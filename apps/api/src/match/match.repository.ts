// src/match/match.repository.ts

import { Injectable } from '@nestjs/common';
import { or } from '@prisma/orm-postgres/orm-client';
import { PrismaService } from '../prisma.service.js';
import type { TxClient } from '../property/property.repository.js';
import type { ScoreableProperty } from './match.scorer.js';
import type { MatchReason } from './types/match-reason.type.js';
import type { Temporal } from 'temporal-spec';
/**
 * Row type mirroring the columns of MatchSuggestion we care about.
 * Hand-written rather than imported from the contract because the contract
 * exposes it as a deeply-readonly object that's awkward to use in partial
 * updates. Cast at the repository boundary, same pattern as ListingRow.
 */
export type MatchSuggestionRow = {
  id: string;
  sourcePropertyId: string;
  candidatePropertyId: string;
  score: number;
  reasons: unknown;
  status: 'PENDING' | 'PARTIALLY_CONFIRMED' | 'CONFIRMED' | 'DISPUTED' | 'EXPIRED';
  sourceConfirmedByUserId: string | null;
  sourceConfirmedByRole: 'CREATOR' | 'AGENT' | 'LANDLORD' | 'TENANT' | 'OPS' | 'ADMIN' | null;
  sourceConfirmedAt: Temporal.Instant | null;
  candidateConfirmedByUserId: string | null;
  candidateConfirmedByRole: 'CREATOR' | 'AGENT' | 'LANDLORD' | 'TENANT' | 'OPS' | 'ADMIN' | null;
  candidateConfirmedAt: Temporal.Instant | null;
  disputedByUserId: string | null;
  disputedByRole: 'CREATOR' | 'AGENT' | 'LANDLORD' | 'TENANT' | 'OPS' | 'ADMIN' | null;
  disputedAt: Temporal.Instant | null;
  disputeReason: string | null;
  mergeId: string | null;
  reportId: string | null;
  createdAt: Temporal.Instant;
  updatedAt: Temporal.Instant;
};

/**
 * Property shape the scorer and candidate queries need.
 * Extends ScoreableProperty (the scorer's narrow input) with the identifiers
 * and flags the repository/service layer needs.
 */
export type PropertyForScoring = ScoreableProperty & {
  id: string;
  name: string | null;
  createdByUserId: string | null;
  mergedIntoId: string | null;
  isProvisional: boolean;
};

/**
 * Suggestion loaded with its source/candidate property rows joined, for the
 * service layer to do actor resolution and scoping without an extra round trip.
 */
export type MatchSuggestionWithRelations = MatchSuggestionRow & {
  sourceProperty: {
    id: string;
    createdByUserId: string | null;
  };
  candidateProperty: {
    id: string;
    createdByUserId: string | null;
  };
};

@Injectable()
export class MatchRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- Property lookups ----------

  /**
   * Load a property with the fields the scorer needs.
   * Returns null when the id is not found.
   */
  async findPropertyForScoring(id: string): Promise<PropertyForScoring | null> {
    const row = await this.prisma.db.orm.public.Property
      .where({ id })
      .first();
    if (!row) return null;
    return this.projectProperty(row);
  }

  /**
   * Candidate generation — geo path.
   *
   * Returns properties in the same state whose lat/lng fall within a rough
   * bounding box around the source point. Precise distance filtering happens
   * in the scorer; this is just a coarse DB-side filter to keep the candidate
   * set small.
   *
   * Exclusions:
   *   - the source property itself
   *   - merged properties (mergedIntoId IS NOT NULL)
   *   - properties already suggested against the source, in any status
   */
  async findNearbyCandidates(params: {
    stateId: string;
    lat: number;
    lng: number;
    radiusMeters: number;
    excludePropertyId: string;
    excludeIds: string[];
    limit: number;
  }): Promise<PropertyForScoring[]> {
    const latDelta = params.radiusMeters / 111_320;
    const lngDelta =
      params.radiusMeters / (111_320 * Math.cos((params.lat * Math.PI) / 180));

    const minLat = params.lat - latDelta;
    const maxLat = params.lat + latDelta;
    const minLng = params.lng - lngDelta;
    const maxLng = params.lng + lngDelta;

    const excludedIds = [params.excludePropertyId, ...params.excludeIds];

    let query = this.prisma.db.orm.public.Property
      .where((p) => p.stateId.eq(params.stateId))
      .where((p) => p.mergedIntoId.isNull())
      .where((p) => p.latitude.gte(minLat))
      .where((p) => p.latitude.lte(maxLat))
      .where((p) => p.longitude.gte(minLng))
      .where((p) => p.longitude.lte(maxLng));

    if (excludedIds.length > 0) {
      query = query.where((p) => p.id.notIn(excludedIds));
    }

    const rows = await query.limit(params.limit).all();
    return rows.map((r) => this.projectProperty(r));
  }

  /**
   * Candidate generation — non-geo fallback.
   *
   * Used when the source has no coords. ILIKE-based overlap on name/address/
   * street within the same state.
   */
  async findNameCandidates(params: {
    stateId: string;
    source: { name: string | null; address: string | null; street: string | null };
    excludePropertyId: string;
    excludeIds: string[];
    limit: number;
  }): Promise<PropertyForScoring[]> {
    const terms = [params.source.name, params.source.address, params.source.street]
      .filter((t): t is string => typeof t === 'string' && t.trim().length >= 3)
      .map((t) => `%${t.trim()}%`);

    if (terms.length === 0) {
      return [];
    }

    const excludedIds = [params.excludePropertyId, ...params.excludeIds];

    let query = this.prisma.db.orm.public.Property
      .where((p) => p.stateId.eq(params.stateId))
      .where((p) => p.mergedIntoId.isNull())
      .where((p) =>
        or(
          ...terms.flatMap((term) => [
            p.name.ilike(term),
            p.address.ilike(term),
            p.street.ilike(term),
          ]),
        ),
      );

    if (excludedIds.length > 0) {
      query = query.where((p) => p.id.notIn(excludedIds));
    }

    const rows = await query.limit(params.limit).all();
    return rows.map((r) => this.projectProperty(r));
  }

  // ---------- Suggestion CRUD ----------

  async insertSuggestion(data: {
    sourcePropertyId: string;
    candidatePropertyId: string;
    score: number;
    reasons: MatchReason[];
  }): Promise<MatchSuggestionRow> {
    const created = await this.prisma.db.orm.public.MatchSuggestion.create({
      sourcePropertyId: data.sourcePropertyId,
      candidatePropertyId: data.candidatePropertyId,
      score: data.score,
      reasons: data.reasons as never,
      status: 'PENDING',
    });
    return created as MatchSuggestionRow;
  }

  async findSuggestionById(
    id: string,
  ): Promise<MatchSuggestionWithRelations | null> {
    const row = await this.prisma.db.orm.public.MatchSuggestion
      .where({ id })
      .include('sourceProperty')
      .include('candidateProperty')
      .first();
    if (!row) return null;
    return row as unknown as MatchSuggestionWithRelations;
  }

  /**
   * Suggestions relevant to a user.
   *
   * includeAll = true (OPS/ADMIN): returns every suggestion.
   * includeAll = false (regular user): returns suggestions where the user is
   * the creator of either property, OR has a VERIFIED LANDLORD relationship
   * on either property.
   */
  async findSuggestionsForUser(params: {
    userId: string;
    includeAll: boolean;
    status?: MatchSuggestionRow['status'];
  }): Promise<MatchSuggestionWithRelations[]> {
    let query = this.prisma.db.orm.public.MatchSuggestion
      .include('sourceProperty')
      .include('candidateProperty');

    if (params.status) {
      query = query.where({ status: params.status });
    }

    const rows = (await query.all()) as unknown as MatchSuggestionWithRelations[];

    rows.sort((a, b) => b.createdAt.epochMilliseconds - a.createdAt.epochMilliseconds);

    if (params.includeAll) {
      return rows;
    }

    const propertyIds = new Set<string>();
    for (const row of rows) {
      propertyIds.add(row.sourcePropertyId);
      propertyIds.add(row.candidatePropertyId);
    }
    const landlordPropertyIds = await this.findVerifiedLandlordPropertyIds({
      userId: params.userId,
      propertyIds: [...propertyIds],
    });
    const landlordSet = new Set(landlordPropertyIds);

    return rows.filter(
      (row) =>
        row.sourceProperty.createdByUserId === params.userId ||
        row.candidateProperty.createdByUserId === params.userId ||
        landlordSet.has(row.sourcePropertyId) ||
        landlordSet.has(row.candidatePropertyId),
    );
  }

  async updateSuggestion(
    id: string,
    patch: Partial<MatchSuggestionRow>,
  ): Promise<MatchSuggestionRow> {
    const { id: _id, createdAt: _c, updatedAt: _u, ...safe } = patch;
    void _id; void _c; void _u;
    const updated = await this.prisma.db.orm.public.MatchSuggestion
      .where({ id })
      .update(safe as never);
    return updated as unknown as MatchSuggestionRow;
  }

  async updateSuggestionTx(
    tx: TxClient,
    id: string,
    patch: Partial<MatchSuggestionRow>,
  ): Promise<MatchSuggestionRow> {
    const { id: _id, createdAt: _c, updatedAt: _u, ...safe } = patch;
    void _id; void _c; void _u;
    const updated = await tx.orm.public.MatchSuggestion
      .where({ id })
      .update(safe as never);
    return updated as unknown as MatchSuggestionRow;
  }

  // ---------- Relationship lookups ----------

  async hasVerifiedRelationship(params: {
    userId: string;
    propertyId: string;
    type: 'LANDLORD' | 'TENANT' | 'RESIDENT' | 'AGENT';
  }): Promise<boolean> {
    const rel = (await this.prisma.db.orm.public.UserPropertyRelationship
      .where({
        userId: params.userId,
        propertyId: params.propertyId,
        relationshipType: params.type,
      })
      .first()) as { id: string } | null;

    if (!rel) return false;

    const verification =
      await this.prisma.db.orm.public.RelationshipVerification
        .where({
          relationshipId: rel.id,
          status: 'VERIFIED',
        })
        .first();

    return verification !== null;
  }

  async findVerifiedLandlordPropertyIds(params: {
    userId: string;
    propertyIds: string[];
  }): Promise<string[]> {
    if (params.propertyIds.length === 0) return [];

    const relationships = (await this.prisma.db.orm.public.UserPropertyRelationship
      .where({
        userId: params.userId,
        relationshipType: 'LANDLORD',
      })
      .where((r) => r.propertyId.in(params.propertyIds))
      .all()) as Array<{ id: string; propertyId: string }>;

    if (relationships.length === 0) return [];

    const relationshipIds = relationships.map((r) => r.id);

    const verifications = (await this.prisma.db.orm.public.RelationshipVerification
      .where({ status: 'VERIFIED' })
      .where((v) => v.relationshipId.in(relationshipIds))
      .all()) as Array<{ relationshipId: string }>;

    const verifiedRelationshipIds = new Set(verifications.map((v) => v.relationshipId));
    return relationships
      .filter((r) => verifiedRelationshipIds.has(r.id))
      .map((r) => r.propertyId);
  }

  // ---------- Report creation ----------

  async createReport(data: {
    targetType: 'PROPERTY';
    targetId: string;
    reporterId: string;
    reason: 'DUPLICATE_LISTING' | 'FRAUD';
    details?: string;
  }): Promise<{ id: string }> {
    const created = await this.prisma.db.orm.public.Report.create({
      targetType: data.targetType,
      targetId: data.targetId,
      reporterId: data.reporterId,
      reason: data.reason,
      details: data.details ?? null,
      status: 'OPEN',
    });
    return { id: (created as { id: string }).id };
  }

  async createReportTx(
    tx: TxClient,
    data: {
      targetType: 'PROPERTY';
      targetId: string;
      reporterId: string;
      reason: 'DUPLICATE_LISTING' | 'FRAUD';
      details?: string;
    },
  ): Promise<{ id: string }> {
    const created = await tx.orm.public.Report.create({
      targetType: data.targetType,
      targetId: data.targetId,
      reporterId: data.reporterId,
      reason: data.reason,
      details: data.details ?? null,
      status: 'OPEN',
    });
    return { id: (created as { id: string }).id };
  }

  // ---------- Helpers ----------

  private projectProperty(row: unknown): PropertyForScoring {
    const r = row as {
      id: string;
      name: string | null;
      propertyType: string;
      stateId: string;
      placeId: string | null;
      address: string | null;
      street: string | null;
      houseNumber: string | null;
      landmark: string | null;
      latitude: number | null;
      longitude: number | null;
      createdByUserId: string | null;
      mergedIntoId: string | null;
      isProvisional: boolean;
    };
    return {
      id: r.id,
      name: r.name,
      propertyType: r.propertyType,
      stateId: r.stateId,
      placeId: r.placeId,
      address: r.address,
      street: r.street,
      houseNumber: r.houseNumber,
      landmark: r.landmark,
      latitude: r.latitude,
      longitude: r.longitude,
      createdByUserId: r.createdByUserId,
      mergedIntoId: r.mergedIntoId,
      isProvisional: r.isProvisional,
    };
  }
}