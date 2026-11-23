// src/match/match-suggestion.service.ts

import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
  } from '@nestjs/common';
  
  import { PrismaService } from '../prisma.service.js';
  import { UserService } from '../user/user.service.js';
  import { PropertyRepository, type TxClient } from '../property/property.repository.js';
  import {
    MatchRepository,
    type MatchSuggestionRow,
    type MatchSuggestionWithRelations,
  } from './match.repository.js';
  import { resolveActor, type MatchActorRole, type ActorSide } from './match.actor.js';
  import { scorePair, SCORE_THRESHOLD, type ScoreableProperty } from './match.scorer.js';
  import type { UserRole } from '../auth/decorators/roles.decorator.js';
  import { Temporal as TemporalRuntime } from '@js-temporal/polyfill';
  import type { Temporal } from 'temporal-spec';
  
  const CANDIDATE_RADIUS_METERS = 200;
  const CANDIDATE_LIMIT = 20;
  
  @Injectable()
  export class MatchSuggestionService {
    private readonly logger = new Logger(MatchSuggestionService.name);
  
    constructor(
      private readonly prisma: PrismaService,
      private readonly userService: UserService,
      private readonly matchRepository: MatchRepository,
      private readonly propertyRepository: PropertyRepository,
    ) {}
  
    // ---------- Generation ----------
  
    /**
     * Look for candidates that might be the same property as `propertyId`,
     * score them, and insert a PENDING MatchSuggestion for each one above
     * SCORE_THRESHOLD.
     *
     * Idempotent: if a suggestion already exists for a candidate pair (in any
     * status), that candidate is skipped.
     *
     * NOT transactional — a partial batch of suggestions is acceptable.
     */
    async generateForProperty(propertyId: string): Promise<void> {
      const source = await this.matchRepository.findPropertyForScoring(propertyId);
      if (!source) {
        this.logger.warn(`generateForProperty: property ${propertyId} not found`);
        return;
      }
      if (source.mergedIntoId) {
        return;
      }
  
      const existing = await this.matchRepository.findSuggestionsForUser({
        userId: source.createdByUserId ?? '',
        includeAll: true,
      });
      const alreadySuggestedCandidateIds = new Set<string>();
      for (const s of existing) {
        if (s.sourcePropertyId === propertyId) {
          alreadySuggestedCandidateIds.add(s.candidatePropertyId);
        }
        if (s.candidatePropertyId === propertyId) {
          alreadySuggestedCandidateIds.add(s.sourcePropertyId);
        }
      }
  
      const candidates = await this.findCandidatesFor(source, alreadySuggestedCandidateIds);
      if (candidates.length === 0) return;
  
      for (const candidate of candidates) {
        const { score, reasons } = scorePair(toScoreable(source), toScoreable(candidate));
        if (score < SCORE_THRESHOLD) continue;
  
        try {
          await this.matchRepository.insertSuggestion({
            sourcePropertyId: source.id,
            candidatePropertyId: candidate.id,
            score,
            reasons,
          });
        } catch (err) {
          if (isUniqueViolation(err)) continue;
          this.logger.error(
            `generateForProperty: failed to insert suggestion ${source.id}→${candidate.id}`,
            err,
          );
        }
      }
    }
  
    // ---------- Listing ----------
  
    async listForUser(params: {
      userId: string;
      status?: MatchSuggestionRow['status'];
    }): Promise<MatchSuggestionWithRelations[]> {
      const dbUser = await this.userService.findById(params.userId);
      if (!dbUser) throw new ForbiddenException('User not found');
  
      const includeAll = dbUser.role === 'OPS' || dbUser.role === 'ADMIN';
      return this.matchRepository.findSuggestionsForUser({
        userId: params.userId,
        includeAll,
        status: params.status,
      });
    }
  
    async getByIdForUser(params: {
      userId: string;
      id: string;
    }): Promise<MatchSuggestionWithRelations> {
      const suggestion = await this.matchRepository.findSuggestionById(params.id);
      if (!suggestion) throw new NotFoundException('Match suggestion not found');
  
      const visible = await this.canView(params.userId, suggestion);
      if (!visible) throw new ForbiddenException('You cannot view this suggestion');
  
      return suggestion;
    }
  
    // ---------- Confirm ----------
  
    /**
     * Confirm that the two properties are the same.
     *
     * Runs inside a transaction so the merge and the suggestion's status update
     * are atomic.
     *
     * If the caller's confirmation is authoritative (verified landlord, OPS,
     * ADMIN), merge immediately. Otherwise mark the caller's side as confirmed
     * and move to PARTIALLY_CONFIRMED unless the other side is already
     * confirmed — in which case merge now.
     */
    async confirm(params: {
      userId: string;
      suggestionId: string;
      side?: 'SOURCE' | 'CANDIDATE';
    }): Promise<MatchSuggestionWithRelations> {
      const suggestion = await this.matchRepository.findSuggestionById(params.suggestionId);
      if (!suggestion) throw new NotFoundException('Match suggestion not found');
  
      if (suggestion.status !== 'PENDING' && suggestion.status !== 'PARTIALLY_CONFIRMED') {
        throw new ConflictException(`Cannot confirm a suggestion in status ${suggestion.status}`);
      }
  
      const dbUser = await this.userService.findById(params.userId);
      if (!dbUser) throw new ForbiddenException('User not found');
  
      const realActor = await this.resolveActorForUser({
        userId: params.userId,
        userRole: dbUser.role as UserRole,
        suggestion,
      });
  
      if (realActor.side === 'NEITHER') {
        throw new ForbiddenException('You are not a party to this suggestion');
      }
  
      const effectiveSide = this.pickSide(realActor.side, params.side);
  
      const alreadyConfirmed =
        (effectiveSide === 'SOURCE' && suggestion.sourceConfirmedAt !== null) ||
        (effectiveSide === 'CANDIDATE' && suggestion.candidateConfirmedAt !== null);
      if (alreadyConfirmed) {
        throw new ConflictException('You have already confirmed this side');
      }
  
      const otherSideConfirmed =
        (effectiveSide === 'SOURCE' && suggestion.candidateConfirmedAt !== null) ||
        (effectiveSide === 'CANDIDATE' && suggestion.sourceConfirmedAt !== null);
  
      const willMerge = realActor.isAuthoritative || otherSideConfirmed;
  
      return this.prisma.db.transaction(async (tx: TxClient) => {
        const confirmPatch: Partial<MatchSuggestionRow> = {};
        if (effectiveSide === 'SOURCE') {
          confirmPatch.sourceConfirmedByUserId = params.userId;
          confirmPatch.sourceConfirmedByRole = realActor.role as MatchActorRole;
          confirmPatch.sourceConfirmedAt = TemporalRuntime.Now.instant() as Temporal.Instant;
        } else {
          confirmPatch.candidateConfirmedByUserId = params.userId;
          confirmPatch.candidateConfirmedByRole = realActor.role as MatchActorRole;
          confirmPatch.candidateConfirmedAt = TemporalRuntime.Now.instant() as Temporal.Instant;
        }
  
        if (willMerge) {
          const { mergeId } = await this.propertyRepository.mergePropertiesTx(tx, {
            sourceId: suggestion.sourcePropertyId,
            targetId: suggestion.candidatePropertyId,
            actorUserId: params.userId,
            reason: `Match suggestion ${suggestion.id} confirmed`,
          });
  
          await this.matchRepository.updateSuggestionTx(tx, suggestion.id, {
            ...confirmPatch,
            status: 'CONFIRMED',
            mergeId,
          });
        } else {
          await this.matchRepository.updateSuggestionTx(tx, suggestion.id, {
            ...confirmPatch,
            status: 'PARTIALLY_CONFIRMED',
          });
        }
  
        const reloaded = await tx.orm.public.MatchSuggestion
          .where({ id: suggestion.id })
          .include('sourceProperty')
          .include('candidateProperty')
          .first();
        return reloaded as unknown as MatchSuggestionWithRelations;
      });
    }
  
    // ---------- Dispute ----------
  
    /**
     * Dispute the suggestion (the two properties are NOT the same).
     *
     * Runs inside a transaction. If `suspicious` is true (default), a Report
     * row is created so the pair enters the moderation queue.
     */
    async dispute(params: {
      userId: string;
      suggestionId: string;
      reason?: string;
      suspicious?: boolean;
    }): Promise<MatchSuggestionWithRelations> {
      const suggestion = await this.matchRepository.findSuggestionById(params.suggestionId);
      if (!suggestion) throw new NotFoundException('Match suggestion not found');
  
      if (suggestion.status !== 'PENDING' && suggestion.status !== 'PARTIALLY_CONFIRMED') {
        throw new ConflictException(`Cannot dispute a suggestion in status ${suggestion.status}`);
      }
  
      const dbUser = await this.userService.findById(params.userId);
      if (!dbUser) throw new ForbiddenException('User not found');
  
      const realActor = await this.resolveActorForUser({
        userId: params.userId,
        userRole: dbUser.role as UserRole,
        suggestion,
      });
      if (realActor.side === 'NEITHER') {
        throw new ForbiddenException('You are not a party to this suggestion');
      }
  
      const suspicious = params.suspicious !== false;
  
      return this.prisma.db.transaction(async (tx: TxClient) => {
        let reportId: string | null = null;
        if (suspicious) {
          const report = await this.matchRepository.createReportTx(tx, {
            targetType: 'PROPERTY',
            targetId: suggestion.sourcePropertyId,
            reporterId: params.userId,
            reason: 'DUPLICATE_LISTING',
            details: params.reason,
          });
          reportId = report.id;
        }
  
        await this.matchRepository.updateSuggestionTx(tx, suggestion.id, {
          status: 'DISPUTED',
          disputedByUserId: params.userId,
          disputedByRole: realActor.role as MatchActorRole,
          disputedAt: TemporalRuntime.Now.instant() as Temporal.Instant,
          disputeReason: params.reason ?? null,
          reportId,
        });
  
        const reloaded = await tx.orm.public.MatchSuggestion
          .where({ id: suggestion.id })
          .include('sourceProperty')
          .include('candidateProperty')
          .first();
        return reloaded as unknown as MatchSuggestionWithRelations;
      });
    }
  
    // ---------- Helpers ----------
  
    private async findCandidatesFor(
      source: {
        id: string;
        stateId: string;
        latitude: number | null;
        longitude: number | null;
        name: string | null;
        address: string | null;
        street: string | null;
      },
      excludeIds: Set<string>,
    ) {
      const excludeArr = [...excludeIds];
  
      if (source.latitude != null && source.longitude != null) {
        return this.matchRepository.findNearbyCandidates({
          stateId: source.stateId,
          lat: source.latitude,
          lng: source.longitude,
          radiusMeters: CANDIDATE_RADIUS_METERS,
          excludePropertyId: source.id,
          excludeIds: excludeArr,
          limit: CANDIDATE_LIMIT,
        });
      }
  
      return this.matchRepository.findNameCandidates({
        stateId: source.stateId,
        source: { name: source.name, address: source.address, street: source.street },
        excludePropertyId: source.id,
        excludeIds: excludeArr,
        limit: CANDIDATE_LIMIT,
      });
    }
  
    private async resolveActorForUser(params: {
      userId: string;
      userRole: UserRole;
      suggestion: MatchSuggestionWithRelations;
    }) {
      const sourceId = params.suggestion.sourceProperty.id;
      const candidateId = params.suggestion.candidateProperty.id;
  
      const [
        landlordSource,
        landlordCandidate,
        agentSource,
        agentCandidate,
        tenantSource,
        tenantCandidate,
        residentSource,
        residentCandidate,
      ] = await Promise.all([
        this.matchRepository.hasVerifiedRelationship({ userId: params.userId, propertyId: sourceId, type: 'LANDLORD' }),
        this.matchRepository.hasVerifiedRelationship({ userId: params.userId, propertyId: candidateId, type: 'LANDLORD' }),
        this.matchRepository.hasVerifiedRelationship({ userId: params.userId, propertyId: sourceId, type: 'AGENT' }),
        this.matchRepository.hasVerifiedRelationship({ userId: params.userId, propertyId: candidateId, type: 'AGENT' }),
        this.matchRepository.hasVerifiedRelationship({ userId: params.userId, propertyId: sourceId, type: 'TENANT' }),
        this.matchRepository.hasVerifiedRelationship({ userId: params.userId, propertyId: candidateId, type: 'TENANT' }),
        this.matchRepository.hasVerifiedRelationship({ userId: params.userId, propertyId: sourceId, type: 'RESIDENT' }),
        this.matchRepository.hasVerifiedRelationship({ userId: params.userId, propertyId: candidateId, type: 'RESIDENT' }),
      ]);
  
      const lookup = (
        propertyId: string,
        type: 'LANDLORD' | 'TENANT' | 'RESIDENT' | 'AGENT',
      ): boolean => {
        if (propertyId === sourceId) {
          if (type === 'LANDLORD') return landlordSource;
          if (type === 'AGENT') return agentSource;
          if (type === 'TENANT') return tenantSource;
          if (type === 'RESIDENT') return residentSource;
        } else {
          if (type === 'LANDLORD') return landlordCandidate;
          if (type === 'AGENT') return agentCandidate;
          if (type === 'TENANT') return tenantCandidate;
          if (type === 'RESIDENT') return residentCandidate;
        }
        return false;
      };
  
      return resolveActor({
        userId: params.userId,
        userRole: params.userRole,
        suggestion: {
          sourceProperty: {
            id: sourceId,
            createdByUserId: params.suggestion.sourceProperty.createdByUserId,
          },
          candidateProperty: {
            id: candidateId,
            createdByUserId: params.suggestion.candidateProperty.createdByUserId,
          },
        },
        hasVerifiedRelationship: lookup,
      });
    }
  
    private pickSide(
      actorSide: ActorSide,
      requested?: 'SOURCE' | 'CANDIDATE',
    ): 'SOURCE' | 'CANDIDATE' {
      if (actorSide === 'NEITHER') {
        throw new ForbiddenException('You are not a party to this suggestion');
      }
      if (actorSide === 'SOURCE' || actorSide === 'CANDIDATE') {
        return actorSide;
      }
      if (!requested) {
        throw new BadRequestException(
          'You are on both sides of this suggestion; specify side as SOURCE or CANDIDATE',
        );
      }
      return requested;
    }
  
    private async canView(
      userId: string,
      suggestion: MatchSuggestionWithRelations,
    ): Promise<boolean> {
      const dbUser = await this.userService.findById(userId);
      if (!dbUser) return false;
      if (dbUser.role === 'OPS' || dbUser.role === 'ADMIN') return true;
  
      if (
        suggestion.sourceProperty.createdByUserId === userId ||
        suggestion.candidateProperty.createdByUserId === userId
      ) {
        return true;
      }
  
      const landlordIds = await this.matchRepository.findVerifiedLandlordPropertyIds({
        userId,
        propertyIds: [suggestion.sourcePropertyId, suggestion.candidatePropertyId],
      });
      return landlordIds.length > 0;
    }
  }
  
  function toScoreable(p: {
    propertyType: string;
    stateId: string;
    placeId: string | null;
    address: string | null;
    street: string | null;
    houseNumber: string | null;
    landmark: string | null;
    latitude: number | null;
    longitude: number | null;
  }): ScoreableProperty {
    return {
      propertyType: p.propertyType,
      stateId: p.stateId,
      placeId: p.placeId,
      address: p.address,
      street: p.street,
      houseNumber: p.houseNumber,
      landmark: p.landmark,
      latitude: p.latitude,
      longitude: p.longitude,
    };
  }
  
  function isUniqueViolation(err: unknown): boolean {
    return (
      typeof err === 'object' &&
      err !== null &&
      'sqlState' in err &&
      (err as { sqlState: string }).sqlState === '23505'
    );
  }