// src/match/tests/property-merge.merge-spec.ts
//
// Integration test for PropertyRepository.mergePropertiesTx / reverseMergeTx.
//
// Why this exists: these two methods are the riskiest code in the match module —
// they reassign every FK that points at Property, handle unique-constraint
// collisions on PropertyMedia and PropertyRelationship, and must roll back
// cleanly on failure. TypeScript can't catch behavioural bugs here, and pure
// unit tests can't exercise real DB constraints. This is the smallest test that
// actually validates the merge.
//
// Pattern: each test runs inside db.transaction(fn) and throws a RollbackSentinel
// at the end, so Prisma Contracts rolls back everything the test created. The
// dev DB is never mutated — a failed test leaves no residue, and a passing test
// leaves no residue either. This is why we don't need prefix-based cleanup or
// TRUNCATEs; the DB itself restores state via rollback.

import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';

import { PrismaService } from '../../prisma.service.js';
import { PropertyRepository, type TxClient } from '../../property/property.repository.js';

/**
 * Sentinel thrown inside the transaction to force a rollback.
 * Caught outside; any other error propagates and fails the test.
 */
class RollbackSentinel extends Error {
  constructor() {
    super('intentional rollback');
  }
}

/**
 * Run `fn` inside a transaction that is guaranteed to roll back.
 * The transaction's writes are visible to `fn` (so assertions see real DB state)
 * but invisible outside it (so the DB is untouched afterwards).
 */
async function withRollback(
  prisma: PrismaService,
  fn: (tx: TxClient) => Promise<void>,
): Promise<void> {
  try {
    await prisma.db.transaction(async (tx) => {
      await fn(tx);
      throw new RollbackSentinel();
    });
  } catch (err) {
    if (err instanceof RollbackSentinel) return;
    throw err;
  }
}

describe('PropertyRepository.mergePropertiesTx / reverseMergeTx (integration)', () => {
  let prisma: PrismaService;
  let repo: PropertyRepository;

  // Looked up once from seed data. The dev DB is expected to have Nigeria + Lagos
  // seeded (see src/prisma/seed.ts). If not, the test fails loudly with a clear
  // message rather than a cryptic FK violation.
  let countryId: string;
  let stateId: string;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
    repo = new PropertyRepository(prisma);

    const country = await prisma.db.orm.public.Country.first({ code: 'NG' });
    if (!country) {
      throw new Error(
        'Seed data missing: expected a Country with code "NG". Run `pnpm db:seed:dev` first.',
      );
    }
    countryId = (country as { id: string }).id;

    const state = await prisma.db.orm.public.State.first({
      countryId,
      code: 'NG-LA',
    });
    if (!state) {
      throw new Error(
        'Seed data missing: expected Lagos State (code "NG-LA") for Nigeria. Run `pnpm db:seed:dev` first.',
      );
    }
    stateId = (state as { id: string }).id;
  });

  afterAll(async () => {
    await prisma.onModuleDestroy();
  });

  /**
   * Create a TEST-tagged user inside the transaction. Returns the id.
   * Email is unique per run via a random suffix, so repeated runs can't collide.
   */
  async function seedUser(tx: TxClient): Promise<string> {
    const suffix = crypto.randomUUID();
    const created = await tx.orm.public.User.create({
      email: `TEST-merge-${suffix}@example.test`,
      emailVerified: true,
      status: 'ACTIVE',
      role: 'USER',
    });
    return (created as { id: string }).id;
  }

  /**
   * Create a Property row with the minimum required fields, plus lat/lng so
   * the merge can be tested with geo set (matches how real properties look).
   */
  async function seedProperty(
    tx: TxClient,
    params: { tag: string; latitude: number; longitude: number; createdByUserId: string },
  ): Promise<string> {
    const created = await tx.orm.public.Property.create({
      name: `TEST-merge-${params.tag}`,
      propertyType: 'APARTMENT',
      countryId,
      stateId,
      address: `TEST-merge-${params.tag} address`,
      street: `TEST-merge-${params.tag} street`,
      houseNumber: '1',
      latitude: params.latitude,
      longitude: params.longitude,
      isProvisional: true,
      createdByUserId: params.createdByUserId,
    });
    return (created as { id: string }).id;
  }

  it('moves listings, observations, media from source to target; sets mergedIntoId; creates PropertyMerge', async () => {
    await withRollback(prisma, async (tx) => {
      const actorUserId = await seedUser(tx);
      const sourceId = await seedProperty(tx, {
        tag: 'src',
        latitude: 6.5095,
        longitude: 3.3711,
        createdByUserId: actorUserId,
      });
      const targetId = await seedProperty(tx, {
        tag: 'tgt',
        latitude: 6.5096,
        longitude: 3.3712,
        createdByUserId: actorUserId,
      });

      // Seed a listing on the source.
      const listing = await tx.orm.public.Listing.create({
        propertyId: sourceId,
        createdByUserId: actorUserId,
        kind: 'RENT',
        status: 'DRAFT',
        title: 'TEST-merge listing',
        displayLocation: 'TEST-merge display',
      });
      const listingId = (listing as { id: string }).id;

      // Seed an observation on the source. observedAt is Temporal-typed
      // (pg/timestamptz-temporal@1), so we pass Temporal.Now.instant(),
      // NOT new Date().
      const observation = await tx.orm.public.Observation.create({
        category: 'POWER',
        propertyId: sourceId,
        observedAt: Temporal.Now.instant(),
      });
      const observationId = (observation as { id: string }).id;

      // Seed a media row + PropertyMedia on the source. Media is the parent;
      // PropertyMedia is the join row that the merge reassigns.
      const media = await tx.orm.public.Media.create({
        storageKey: `TEST-merge/${crypto.randomUUID()}`,
        url: `https://test.local/${crypto.randomUUID()}`,
        mime: 'image/jpeg',
        size: 1234,
        purpose: 'PROPERTY_PHOTO',
        status: 'READY',
        createdByUserId: actorUserId,
      });
      const mediaId = (media as { id: string }).id;

      const propertyMedia = await tx.orm.public.PropertyMedia.create({
        propertyId: sourceId,
        mediaId,
        sortOrder: 0,
        source: 'OWNER_UPLOAD',
      });
      const propertyMediaId = (propertyMedia as { id: string }).id;

      // ---- Merge ----
      const { mergeId } = await repo.mergePropertiesTx(tx, {
        sourceId,
        targetId,
        actorUserId,
        reason: 'integration test',
      });

      expect(mergeId).toBeTruthy();

      // ---- Assertions ----
      // Listing moved.
      const movedListing = await tx.orm.public.Listing.where({ id: listingId }).first();
      expect((movedListing as { propertyId: string }).propertyId).toBe(targetId);

      // Observation moved.
      const movedObservation = await tx.orm.public.Observation.where({ id: observationId }).first();
      expect((movedObservation as { propertyId: string }).propertyId).toBe(targetId);

      // PropertyMedia moved.
      const movedMedia = await tx.orm.public.PropertyMedia.where({ id: propertyMediaId }).first();
      expect((movedMedia as { propertyId: string }).propertyId).toBe(targetId);
      expect((movedMedia as { hiddenAt: unknown }).hiddenAt).toBeNull();

      // Source marked merged.
      const source = await tx.orm.public.Property.where({ id: sourceId }).first();
      expect((source as { mergedIntoId: string | null }).mergedIntoId).toBe(targetId);

      // PropertyMerge row created.
      const merge = await tx.orm.public.PropertyMerge.where({ id: mergeId }).first();
      expect(merge).toBeTruthy();
      expect((merge as { fromPropertyId: string }).fromPropertyId).toBe(sourceId);
      expect((merge as { toPropertyId: string }).toPropertyId).toBe(targetId);
      expect((merge as { reversedAt: unknown }).reversedAt).toBeNull();
    });
  });

  it('hides the source media row when the target already has the same media', async () => {
    await withRollback(prisma, async (tx) => {
      const actorUserId = await seedUser(tx);
      const sourceId = await seedProperty(tx, {
        tag: 'src',
        latitude: 6.5095,
        longitude: 3.3711,
        createdByUserId: actorUserId,
      });
      const targetId = await seedProperty(tx, {
        tag: 'tgt',
        latitude: 6.5096,
        longitude: 3.3712,
        createdByUserId: actorUserId,
      });

      // One media row, attached to BOTH properties — this is the collision case.
      const media = await tx.orm.public.Media.create({
        storageKey: `TEST-merge/${crypto.randomUUID()}`,
        url: `https://test.local/${crypto.randomUUID()}`,
        mime: 'image/jpeg',
        size: 1234,
        purpose: 'PROPERTY_PHOTO',
        status: 'READY',
        createdByUserId: actorUserId,
      });
      const mediaId = (media as { id: string }).id;

      await tx.orm.public.PropertyMedia.create({
        propertyId: sourceId,
        mediaId,
        sortOrder: 0,
        source: 'OWNER_UPLOAD',
      });
      const targetSide = await tx.orm.public.PropertyMedia.create({
        propertyId: targetId,
        mediaId,
        sortOrder: 0,
        source: 'OWNER_UPLOAD',
      });
      const targetSideId = (targetSide as { id: string }).id;

      const { mergeId } = await repo.mergePropertiesTx(tx, {
        sourceId,
        targetId,
        actorUserId,
      });

      // Target-side row survives.
      const targetRow = await tx.orm.public.PropertyMedia.where({ id: targetSideId }).first();
      expect(targetRow).toBeTruthy();
      expect((targetRow as { hiddenAt: unknown }).hiddenAt).toBeNull();

      // Source-side row is hidden, not deleted, and points at this merge.
      const sourceRow = await tx.orm.public.PropertyMedia
        .where({ propertyId: sourceId, mediaId })
        .first();
      expect(sourceRow).toBeTruthy();
      expect((sourceRow as { hiddenAt: unknown }).hiddenAt).not.toBeNull();
      expect((sourceRow as { hiddenByMergeId: string | null }).hiddenByMergeId).toBe(mergeId);
    });
  });

  it('reverses the merge: mergedIntoId cleared, media unhidden, merge marked reversed', async () => {
    await withRollback(prisma, async (tx) => {
      const actorUserId = await seedUser(tx);
      const sourceId = await seedProperty(tx, {
        tag: 'src',
        latitude: 6.5095,
        longitude: 3.3711,
        createdByUserId: actorUserId,
      });
      const targetId = await seedProperty(tx, {
        tag: 'tgt',
        latitude: 6.5096,
        longitude: 3.3712,
        createdByUserId: actorUserId,
      });

      // Seed media on BOTH sides so the merge hides the source-side row —
      // then reversal must un-hide it.
      const media = await tx.orm.public.Media.create({
        storageKey: `TEST-merge/${crypto.randomUUID()}`,
        url: `https://test.local/${crypto.randomUUID()}`,
        mime: 'image/jpeg',
        size: 1234,
        purpose: 'PROPERTY_PHOTO',
        status: 'READY',
        createdByUserId: actorUserId,
      });
      const mediaId = (media as { id: string }).id;

      await tx.orm.public.PropertyMedia.create({
        propertyId: sourceId,
        mediaId,
        sortOrder: 0,
        source: 'OWNER_UPLOAD',
      });
      await tx.orm.public.PropertyMedia.create({
        propertyId: targetId,
        mediaId,
        sortOrder: 0,
        source: 'OWNER_UPLOAD',
      });

      const { mergeId } = await repo.mergePropertiesTx(tx, {
        sourceId,
        targetId,
        actorUserId,
      });

      // Reverse it.
      await repo.reverseMergeTx(tx, { mergeId, actorUserId });

      // Source no longer marked merged.
      const source = await tx.orm.public.Property.where({ id: sourceId }).first();
      expect((source as { mergedIntoId: string | null }).mergedIntoId).toBeNull();

      // Merge marked reversed.
      const merge = await tx.orm.public.PropertyMerge.where({ id: mergeId }).first();
      expect((merge as { reversedAt: unknown }).reversedAt).not.toBeNull();
      expect((merge as { reversedById: string | null }).reversedById).toBe(actorUserId);

      // Source-side media row is visible again.
      const sourceMedia = await tx.orm.public.PropertyMedia
        .where({ propertyId: sourceId, mediaId })
        .first();
      expect(sourceMedia).toBeTruthy();
      expect((sourceMedia as { hiddenAt: unknown }).hiddenAt).toBeNull();
      expect((sourceMedia as { hiddenByMergeId: string | null }).hiddenByMergeId).toBeNull();
    });
  });
});