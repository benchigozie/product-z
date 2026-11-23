import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import type { PropertyListResult, PropertyResult } from './types/property-result.type.js';

import { Temporal } from '@js-temporal/polyfill';

/**
 * The type of the transaction client Prisma Contracts passes into
 * `db.transaction(fn)`. Same shape as `db` — `tx.orm`, `tx.sql`, etc. —
 * so we can type the transaction-scoped methods against it directly.
 */
export type TxClient = Parameters<
  Parameters<PrismaService['db']['transaction']>[0]
>[0] & {
  orm: PrismaService['db']['orm'];
  sql: PrismaService['db']['sql'];
};

@Injectable()
export class PropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const plan = this.prisma.db.sql.public.property
      .select(
        'id',
        'name',
        'propertyType',
        'countryId',
        'stateId',
        'placeId',
        'address',
        'street',
        'houseNumber',
        'unitIdentifier',
        'landmark',
        'latitude',
        'longitude',
        'createdAt',
        'updatedAt',
      )
      .build();

    const result = await this.prisma.db.runtime().query(plan);

    console.log('FIND ALL RESULT:', result);

    return result;
  }

  async create(data: CreatePropertyDto) {
    const plan = this.prisma.db.sql.public.property
      .insert([
        {
          name: data.name,
          propertyType: data.propertyType,
          countryId: data.countryId,
          stateId: data.stateId,
          placeId: data.placeId,
          address: data.address,
          street: data.street,
          houseNumber: data.houseNumber,
          unitIdentifier: data.unitIdentifier,
          landmark: data.landmark,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      ])
      .returning(
        'id',
        'name',
        'propertyType',
        'countryId',
        'stateId',
        'placeId',
        'address',
        'street',
        'houseNumber',
        'unitIdentifier',
        'landmark',
        'latitude',
        'longitude',
        'createdAt',
        'updatedAt',
      )
      .build();

    const result = await this.prisma.db.runtime().query(plan);

    return result;
  }

  async findById(id: string) : Promise<PropertyResult> {
    return this.prisma.db.orm.public.Property.first({ id });
  }

  async findByPlaceId(placeId: string) : Promise<PropertyListResult> {
    return this.prisma.db.orm.public.Property
      .where({ placeId })
      .all();
  }

  // ---------- Merge / unmerge (transaction-scoped) ----------

  /**
   * Merge `sourceId` into `targetId` inside an open transaction.
   *
   * Every FK that points at Property gets reassigned from source to target.
   * Where a reassignment would violate a unique constraint or create a
   * self-reference, the source-side row is deleted rather than updated —
   * EXCEPT for PropertyMedia, where the source-side row is hidden (not
   * deleted) so that reverseMerge can restore it later.
   *
   * The caller is responsible for opening the transaction and for the
   * non-transactional guards (existence, mergedIntoId, self-merge). This
   * method assumes those have passed.
   */
  async mergePropertiesTx(
    tx: TxClient,
    params: {
      sourceId: string;
      targetId: string;
      actorUserId: string;
      reason?: string;
    },
  ): Promise<{ mergeId: string }> {
    const { sourceId, targetId, actorUserId, reason } = params;

    // 1. Record the merge first, so we have mergeId for hiddenByMergeId
    //    references in the media step below.
    const merge = (await tx.orm.public.PropertyMerge.create({
      fromPropertyId: sourceId,
      toPropertyId: targetId,
      actorId: actorUserId,
      reason: reason ?? null,
    })) as { id: string };
    const mergeId = merge.id;

    // 2. Listings — no unique conflicts on the propertyId side.
    await tx.orm.public.Listing
      .where({ propertyId: sourceId })
      .update({ propertyId: targetId });

    // 3. Observations — same.
    await tx.orm.public.Observation
      .where({ propertyId: sourceId })
      .update({ propertyId: targetId });

    // 4. PropertyMedia — collision on @@unique([propertyId, mediaId]).
    //    If the target already has this media, hide the source-side row
    //    (preserve for reversal); otherwise reassign.
    const sourceMedia = (await tx.orm.public.PropertyMedia
      .where({ propertyId: sourceId })
      .all()) as Array<{ id: string; mediaId: string }>;

    const targetMedia = (await tx.orm.public.PropertyMedia
      .where({ propertyId: targetId })
      .all()) as Array<{ mediaId: string }>;

    const targetMediaIds = new Set(targetMedia.map((m) => m.mediaId));

    for (const media of sourceMedia) {
      if (targetMediaIds.has(media.mediaId)) {
        // Collision — hide instead of reassign.
        await tx.orm.public.PropertyMedia
        .where({ id: media.id })
        .update({
          hiddenAt: Temporal.Now.instant(),
          hiddenByMergeId: mergeId,
        });
      } else {
        await tx.orm.public.PropertyMedia
          .where({ id: media.id })
          .update({ propertyId: targetId });
      }
    }

    // 5. UserPropertyRelationship — no unique constraint, safe to reassign.
    //    A user who had relationships on both properties ends up with two
    //    rows on the (now-merged) target — that's intentional temporal history.
    await tx.orm.public.UserPropertyRelationship
      .where({ propertyId: sourceId })
      .update({ propertyId: targetId });

    // 6. PropertyRelationship — tricky, because childPropertyId is UNIQUE.
    //
    //    Two directions to handle:
    //      a. Rows where source is PARENT (source contains X):
    //         reassign parent → target, unless (target, X) already exists
    //         (drop the source-side row) or X === target (self-reference,
    //         drop the row).
    //      b. Rows where source is CHILD (X contains source):
    //         reassign child → target, unless (X, target) already exists
    //         (drop) or X === target (self-reference, drop).
    //
    //    We do (a) first, then (b).

    // 6a. source is parent.
    const asParent = (await tx.orm.public.PropertyRelationship
      .where({ parentPropertyId: sourceId })
      .all()) as Array<{ id: string; childPropertyId: string }>;

    for (const rel of asParent) {
      if (rel.childPropertyId === targetId) {
        // Would become (target, target) — drop.
        await tx.orm.public.PropertyRelationship.where({ id: rel.id }).delete();
        continue;
      }
      const existing = await tx.orm.public.PropertyRelationship
        .where({
          parentPropertyId: targetId,
          childPropertyId: rel.childPropertyId,
        })
        .first();
      if (existing) {
        // Would duplicate an existing pair — drop.
        await tx.orm.public.PropertyRelationship.where({ id: rel.id }).delete();
      } else {
        await tx.orm.public.PropertyRelationship
          .where({ id: rel.id })
          .update({ parentPropertyId: targetId });
      }
    }

    // 6b. source is child.
    const asChild = (await tx.orm.public.PropertyRelationship
      .where({ childPropertyId: sourceId })
      .first()) as { id: string; parentPropertyId: string } | null;

    if (asChild) {
      if (asChild.parentPropertyId === targetId) {
        // Would become (target, target) — drop.
        await tx.orm.public.PropertyRelationship.where({ id: asChild.id }).delete();
      } else {
        const existing = await tx.orm.public.PropertyRelationship
          .where({
            parentPropertyId: asChild.parentPropertyId,
            childPropertyId: targetId,
          })
          .first();
        if (existing) {
          await tx.orm.public.PropertyRelationship.where({ id: asChild.id }).delete();
        } else {
          await tx.orm.public.PropertyRelationship
            .where({ id: asChild.id })
            .update({ childPropertyId: targetId });
        }
      }
    }

    // 7. VerificationReport.
    await tx.orm.public.VerificationReport
      .where({ propertyId: sourceId })
      .update({ propertyId: targetId });

    // 8. Inspection.
    await tx.orm.public.Inspection
      .where({ propertyId: sourceId })
      .update({ propertyId: targetId });

    // 9. ListingReferral.
    await tx.orm.public.ListingReferral
      .where({ propertyId: sourceId })
      .update({ propertyId: targetId });

    // 10. Intelligence — propertyId is @unique, so if target already has one
    //     we drop source's (it's stale post-merge anyway) and leave target's.
    //     If only source has one, move it to target.
    const sourceIntelligence = await tx.orm.public.Intelligence
      .where({ propertyId: sourceId })
      .first();
    if (sourceIntelligence) {
      const targetIntelligence = await tx.orm.public.Intelligence
        .where({ propertyId: targetId })
        .first();
      if (targetIntelligence) {
        await tx.orm.public.Intelligence
          .where({ propertyId: sourceId })
          .delete();
      } else {
        await tx.orm.public.Intelligence
          .where({ propertyId: sourceId })
          .update({ propertyId: targetId });
      }
    }

    // 11. Mark source as merged.
    await tx.orm.public.Property
      .where({ id: sourceId })
      .update({ mergedIntoId: targetId });

    // 12. Expire any other open suggestions touching either property, so
    //     the queue doesn't keep surfacing pairs that are now moot.
    //     Four sequential updates — one per side — rather than a single
    //     OR expression, which the fluent ORM API doesn't express cleanly.
    for (const propertyId of [sourceId, targetId]) {
      await tx.orm.public.MatchSuggestion
        .where({ status: 'PENDING' })
        .where((s) => s.sourcePropertyId.eq(propertyId))
        .update({ status: 'EXPIRED' });

      await tx.orm.public.MatchSuggestion
        .where({ status: 'PENDING' })
        .where((s) => s.candidatePropertyId.eq(propertyId))
        .update({ status: 'EXPIRED' });
    }

    return { mergeId };
  }

  /**
   * Reverse a merge. Assumes the caller has verified the merge exists and
   * is not already reversed. Reverses each step of mergePropertiesTx in
   * reverse order.
   *
   * v1 limitation: reversal is clean only if it happens before new content
   * accrues on the target property. Reassignment of listings/observations
   * back to source is gated on createdAt < merge.createdAt — rows created
   * after the merge stay on the target. A fully reversible merge would
   * require per-row provenance columns (movedByMergeId) on each affected
   * table; that is a v2 improvement.
   */
  async reverseMergeTx(
    tx: TxClient,
    params: { mergeId: string; actorUserId: string },
  ): Promise<void> {
    const { mergeId, actorUserId } = params;

    const merge = (await tx.orm.public.PropertyMerge
      .where({ id: mergeId })
      .first()) as {
      id: string;
      fromPropertyId: string;
      toPropertyId: string;
      createdAt: Date;
    } | null;
    if (!merge) {
      throw new Error(`PropertyMerge ${mergeId} not found`);
    }
    const sourceId = merge.fromPropertyId;
    const targetId = merge.toPropertyId;

    // 1. Clear the merged marker on the source.
    await tx.orm.public.Property
      .where({ id: sourceId })
      .update({ mergedIntoId: null });

    // 2. Un-hide media that was hidden by this merge.
    await tx.orm.public.PropertyMedia
      .where({ hiddenByMergeId: mergeId })
      .update({ hiddenAt: null, hiddenByMergeId: null });

    // 3. Reassign listings back to source where they were created before
    //    the merge. Listings created on target after the merge stay there.
    await tx.orm.public.Listing
      .where({ propertyId: targetId })
      .where((l) => l.createdAt.lt(merge.createdAt))
      .update({ propertyId: sourceId });

    // 4. Same for observations.
    await tx.orm.public.Observation
      .where({ propertyId: targetId })
      .where((o) => o.createdAt.lt(merge.createdAt))
      .update({ propertyId: sourceId });

    // 5. Mark the merge reversed.
    await tx.orm.public.PropertyMerge
    .where({ id: mergeId })
    .update({
      reversedAt: Temporal.Now.instant(),
      reversedById: actorUserId,
    });
  }
}