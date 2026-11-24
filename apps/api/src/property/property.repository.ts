import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import type { PropertyListResult, PropertyResult } from './types/property-result.type.js';

import { Temporal } from '@js-temporal/polyfill';

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

  async findById(id: string): Promise<PropertyResult> {
    return this.prisma.db.orm.public.Property.first({ id });
  }

  async findByPlaceId(placeId: string): Promise<PropertyListResult> {
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
   *
   * NOTE: Prisma 8's `.update()` on a filtered collection mutates only ONE
   * matching row. Anywhere we mean "all matching rows", we use `.updateAll()`.
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
      .updateAll({ propertyId: targetId });

    // 3. Observations — same.
    await tx.orm.public.Observation
      .where({ propertyId: sourceId })
      .updateAll({ propertyId: targetId });

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
        // Single row by id — .update() is correct here.
        await tx.orm.public.PropertyMedia
          .where({ id: media.id })
          .update({ propertyId: targetId });
      }
    }

    // 5. UserPropertyRelationship — no unique constraint, safe to reassign.
    await tx.orm.public.UserPropertyRelationship
      .where({ propertyId: sourceId })
      .updateAll({ propertyId: targetId });

    // 6. PropertyRelationship — childPropertyId is UNIQUE.
    // 6a. source is parent.
    const asParent = (await tx.orm.public.PropertyRelationship
      .where({ parentPropertyId: sourceId })
      .all()) as Array<{ id: string; childPropertyId: string }>;

    for (const rel of asParent) {
      if (rel.childPropertyId === targetId) {
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
      .updateAll({ propertyId: targetId });

    // 8. Inspection.
    await tx.orm.public.Inspection
      .where({ propertyId: sourceId })
      .updateAll({ propertyId: targetId });

    // 9. ListingReferral.
    await tx.orm.public.ListingReferral
      .where({ propertyId: sourceId })
      .updateAll({ propertyId: targetId });

    // 10. Intelligence — propertyId is @unique, at most one row on source.
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

    // 12. Expire other open suggestions touching either property.
    for (const propertyId of [sourceId, targetId]) {
      await tx.orm.public.MatchSuggestion
        .where({ status: 'PENDING' })
        .where((s) => s.sourcePropertyId.eq(propertyId))
        .updateAll({ status: 'EXPIRED' });

      await tx.orm.public.MatchSuggestion
        .where({ status: 'PENDING' })
        .where((s) => s.candidatePropertyId.eq(propertyId))
        .updateAll({ status: 'EXPIRED' });
    }

    return { mergeId };
  }

  /**
   * Reverse a merge. Reverses each step of mergePropertiesTx in reverse order.
   *
   * v1 limitation: reversal is clean only if it happens before new content
   * accrues on the target property. Reassignment of listings/observations
   * back to source is gated on createdAt < merge.createdAt.
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

    // 2. Un-hide media that was hidden by this merge. Multiple rows.
    await tx.orm.public.PropertyMedia
      .where({ hiddenByMergeId: mergeId })
      .updateAll({ hiddenAt: null, hiddenByMergeId: null });

    // 3. Reassign listings back to source where they were created before
    //    the merge. Multiple rows.
    await tx.orm.public.Listing
      .where({ propertyId: targetId })
      .where((l) => l.createdAt.lt(merge.createdAt))
      .updateAll({ propertyId: sourceId });

    // 4. Same for observations. Multiple rows.
    await tx.orm.public.Observation
      .where({ propertyId: targetId })
      .where((o) => o.createdAt.lt(merge.createdAt))
      .updateAll({ propertyId: sourceId });

    // 5. Mark the merge reversed.
    await tx.orm.public.PropertyMerge
      .where({ id: mergeId })
      .update({
        reversedAt: Temporal.Now.instant(),
        reversedById: actorUserId,
      });
  }
}