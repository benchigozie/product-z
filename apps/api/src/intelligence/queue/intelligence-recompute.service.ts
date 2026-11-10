import { Injectable, Logger } from '@nestjs/common';
import { Temporal } from '@js-temporal/polyfill';
import { PrismaService } from '../../prisma.service.js';

import { EvidenceAnalysisService } from '../evidence/evidence-analysis.service.js';
import { WaterEvidenceAnalysisService } from '../evidence/water-evidence-analysis.service.js';
import { FloodingEvidenceAnalysisService } from '../evidence/flooding-evidence-analysis.service.js';
import { EvidenceWeightingService } from '../evidence/evidence-weighting.service.js';
import { EvidenceConsolidationService } from '../consolidation/evidence-consolidation.service.js';
import { PowerClaimAgreementAnalysisService } from '../consolidation/strategies/power-claim-agreement-analysis.service.js';
import { WaterClaimAgreementAnalysisService } from '../consolidation/strategies/water-claim-agreement-analysis.service.js';
import { FloodingClaimAgreementAnalysisService } from '../consolidation/strategies/flooding-claim-agreement-analysis.service.js';
import { PowerIntelligenceService } from '../power-intelligence.service.js';
import { WaterIntelligenceService } from '../water-intelligence.service.js';
import { FloodingIntelligenceService } from '../flooding-intelligence.service.js';

import { ObservationCategory } from '../../observation/enums/observation-category.enum.js';
import type { ObservationListResult } from '../../observation/types/observation-result.type.js';

import { IntelligenceLockService } from './intelligence-lock.service.js';
import type { IntelligenceRecomputeJobData } from './intelligence-recompute.constants.js';

import { SecurityEvidenceAnalysisService } from '../evidence/security-evidence-analysis.service.js';
import { SecurityClaimAgreementAnalysisService } from '../consolidation/strategies/security-claim-agreement-analysis.service.js';
import { SecurityIntelligenceService } from '../security-intelligence.service.js';

import { InternetEvidenceAnalysisService } from '../evidence/internet-evidence-analysis.service.js';
import { InternetClaimAgreementAnalysisService } from '../consolidation/strategies/internet-claim-agreement-analysis.service.js';
import { InternetIntelligenceService } from '../internet-intelligence.service.js';

import { SanitationEvidenceAnalysisService } from '../evidence/sanitation-evidence-analysis.service.js';
import { SanitationClaimAgreementAnalysisService } from '../consolidation/strategies/sanitation-claim-agreement-analysis.service.js';
import { SanitationIntelligenceService } from '../sanitation-intelligence.service.js';

import { RoadAccessEvidenceAnalysisService } from '../evidence/road-access-evidence-analysis.service.js';
import { RoadAccessClaimAgreementAnalysisService } from '../consolidation/strategies/road-access-claim-agreement-analysis.service.js';
import { RoadAccessIntelligenceService } from '../road-access-intelligence.service.js';

import { BuildingConditionEvidenceAnalysisService } from '../evidence/building-condition-evidence-analysis.service.js';
import { BuildingConditionClaimAgreementAnalysisService } from '../consolidation/strategies/building-condition-claim-agreement-analysis.service.js';
import { BuildingConditionIntelligenceService } from '../building-condition-intelligence.service.js';

const CATEGORY_PROMPT_VERSION: Record<string, string> = {
    POWER: '1',
    WATER: '1',
    FLOODING: '1',
    SECURITY: '1',
    INTERNET: '1',
    SANITATION: '1',
    ROAD_ACCESS: '1',
    BUILDING_CONDITION: '1',
};

@Injectable()
export class IntelligenceRecomputeService {
    private readonly logger = new Logger(IntelligenceRecomputeService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly lock: IntelligenceLockService,
        private readonly evidenceWeighting: EvidenceWeightingService,
        private readonly evidenceConsolidation: EvidenceConsolidationService,

        private readonly powerAnalysis: EvidenceAnalysisService,
        private readonly powerClaimAgreement: PowerClaimAgreementAnalysisService,
        private readonly powerIntelligence: PowerIntelligenceService,

        private readonly waterAnalysis: WaterEvidenceAnalysisService,
        private readonly waterClaimAgreement: WaterClaimAgreementAnalysisService,
        private readonly waterIntelligence: WaterIntelligenceService,

        private readonly floodingAnalysis: FloodingEvidenceAnalysisService,
        private readonly floodingClaimAgreement: FloodingClaimAgreementAnalysisService,
        private readonly floodingIntelligence: FloodingIntelligenceService,

        private readonly securityAnalysis: SecurityEvidenceAnalysisService,
        private readonly securityClaimAgreement: SecurityClaimAgreementAnalysisService,
        private readonly securityIntelligence: SecurityIntelligenceService,

        private readonly internetAnalysis: InternetEvidenceAnalysisService,
        private readonly internetClaimAgreement: InternetClaimAgreementAnalysisService,
        private readonly internetIntelligence: InternetIntelligenceService,

        private readonly sanitationAnalysis: SanitationEvidenceAnalysisService,
        private readonly sanitationClaimAgreement: SanitationClaimAgreementAnalysisService,
        private readonly sanitationIntelligence: SanitationIntelligenceService,

        private readonly roadAccessAnalysis: RoadAccessEvidenceAnalysisService,
        private readonly roadAccessClaimAgreement: RoadAccessClaimAgreementAnalysisService,
        private readonly roadAccessIntelligence: RoadAccessIntelligenceService,

        private readonly buildingConditionAnalysis: BuildingConditionEvidenceAnalysisService,
        private readonly buildingConditionClaimAgreement: BuildingConditionClaimAgreementAnalysisService,
        private readonly buildingConditionIntelligence: BuildingConditionIntelligenceService,
    ) { }

    async recompute(job: IntelligenceRecomputeJobData): Promise<void> {
        if (job.propertyId) {
            return this.recomputeProperty(job.propertyId, job);
        }
        if (job.placeId) {
            return this.recomputePlace(job.placeId, job);
        }
        throw new Error('Job must specify propertyId or placeId.');
    }

    private async recomputeProperty(
        propertyId: string,
        job: IntelligenceRecomputeJobData,
    ): Promise<void> {
        await this.lock.withPropertyLock(propertyId, async () => {
            const rawObservations =
                await this.prisma.db.orm.public.Observation
                    .where({ propertyId })
                    .all();

            // TODO: The pipeline services assume observedAt is a Date, but
            // Prisma 8 returns its own temporal type. Normalize at this boundary.
            // Long-term: introduce an ObservationResult → domain mapper and use
            // it everywhere observations cross into the intelligence pipeline.
            const observations = rawObservations.map((o) => ({
                ...o,
                observedAt: o.observedAt instanceof Date
                    ? o.observedAt
                    : new Date(String(o.observedAt)),
            })) as ObservationListResult;

            if (observations.length === 0) {
                this.logger.warn(
                    `No observations for property ${propertyId}; skipping.`,
                );
                return;
            }

            const categoryObservations = observations.filter(
                (o) => o.category === job.category,
            );

            if (categoryObservations.length === 0) {
                this.logger.warn(
                    `No ${job.category} observations for property ${propertyId}; skipping.`,
                );
                return;
            }

            const result = await this.runPipeline(
                job.category as ObservationCategory,
                observations,
            );

            const evidenceThroughMs = Math.max(
                ...categoryObservations.map((o) =>
                    new Date(o.observedAt as unknown as string).getTime(),
                ),
            );
            const evidenceThrough =
                Temporal.Instant.fromEpochMilliseconds(evidenceThroughMs);

            const existing = await this.prisma.db.orm.public.Intelligence
                .where({ propertyId })
                .first();

            const existingCategories: Record<string, any> =
                (existing?.categories as Record<string, any> | null) ?? {};

            const now = Temporal.Now.instant();

            const updatedCategories: Record<string, any> = {
                ...existingCategories,
                [job.category.toLowerCase()]: {
                    conclusion: result.conclusion,
                    confidence: result.confidence,
                    reason: result.reason,
                    reasonSignals: result.reasonSignals,
                    evidenceReferences: result.evidenceReferences,
                    considerations: result.considerations,
                    promptVersion:
                        CATEGORY_PROMPT_VERSION[job.category] ?? '1',
                    evidenceThrough: evidenceThrough.toString(),
                    computedAt: now.toString(),
                },
            };

            if (existing) {
                await this.prisma.db.orm.public.Intelligence
                    .where({ propertyId })
                    .update({
                        status: 'CURRENT',
                        categories: updatedCategories,
                        computedAt: now,
                        evidenceThrough,
                        lastRecomputeReason: job.reason,
                        failureReason: null,
                    });
            } else {
                const plan = this.prisma.db.sql.public.intelligence
                    .insert([
                        {
                            propertyId,
                            status: 'CURRENT',
                            categories: updatedCategories,
                            overall: {} as any,
                            considerations: [] as any,
                            computedAt: now,
                            evidenceThrough,
                            lastRecomputeReason: job.reason,
                        },
                    ])
                    .returning(
                        'id',
                        'propertyId',
                        'status',
                        'categories',
                        'overall',
                        'considerations',
                        'computedAt',
                        'evidenceThrough',
                        'lastRecomputeReason',
                    )
                    .build();

                await this.prisma.db.runtime().query(plan);
            }

            this.logger.log(
                `Recomputed ${job.category} intelligence for property ${propertyId} (reason: ${job.reason})`,
            );
        });
    }

    private async recomputePlace(
        placeId: string,
        job: IntelligenceRecomputeJobData,
    ): Promise<void> {
        await this.lock.withPlaceLock(placeId, async () => {
            const rawObservations =
                await this.prisma.db.orm.public.Observation
                    .where({ placeId })
                    .all();

            const observations = rawObservations.map((o) => ({
                ...o,
                observedAt: o.observedAt instanceof Date
                    ? o.observedAt
                    : new Date(String(o.observedAt)),
            })) as ObservationListResult;

            if (observations.length === 0) {
                this.logger.warn(
                    `No observations for place ${placeId}; skipping.`,
                );
                return;
            }

            const categoryObservations = observations.filter(
                (o) => o.category === job.category,
            );

            if (categoryObservations.length === 0) {
                this.logger.warn(
                    `No ${job.category} observations for place ${placeId}; skipping.`,
                );
                return;
            }

            const result = await this.runPipeline(
                job.category as ObservationCategory,
                observations,
            );

            const evidenceThroughMs = Math.max(
                ...categoryObservations.map((o) =>
                    new Date(o.observedAt as unknown as string).getTime(),
                ),
            );
            const evidenceThrough =
                Temporal.Instant.fromEpochMilliseconds(evidenceThroughMs);

            const existing = await this.prisma.db.orm.public.Intelligence
                .where({ placeId })
                .first();

            const existingCategories: Record<string, any> =
                (existing?.categories as Record<string, any> | null) ?? {};

            const now = Temporal.Now.instant();

            const updatedCategories: Record<string, any> = {
                ...existingCategories,
                [job.category.toLowerCase()]: {
                    conclusion: result.conclusion,
                    confidence: result.confidence,
                    reason: result.reason,
                    reasonSignals: result.reasonSignals,
                    evidenceReferences: result.evidenceReferences,
                    considerations: result.considerations,
                    promptVersion: CATEGORY_PROMPT_VERSION[job.category] ?? '1',
                    evidenceThrough: evidenceThrough.toString(),
                    computedAt: now.toString(),
                },
            };

            if (existing) {
                await this.prisma.db.orm.public.Intelligence
                    .where({ placeId })
                    .update({
                        status: 'CURRENT',
                        categories: updatedCategories,
                        computedAt: now,
                        evidenceThrough,
                        lastRecomputeReason: job.reason,
                        failureReason: null,
                    });
            } else {
                const plan = this.prisma.db.sql.public.intelligence
                    .insert([
                        {
                            placeId,
                            status: 'CURRENT',
                            categories: updatedCategories,
                            overall: {} as any,
                            considerations: [] as any,
                            computedAt: now,
                            evidenceThrough,
                            lastRecomputeReason: job.reason,
                        },
                    ])
                    .returning(
                        'id',
                        'placeId',
                        'status',
                        'categories',
                        'overall',
                        'considerations',
                        'computedAt',
                        'evidenceThrough',
                        'lastRecomputeReason',
                    )
                    .build();

                await this.prisma.db.runtime().query(plan);
            }

            this.logger.log(
                `Recomputed ${job.category} intelligence for place ${placeId} (reason: ${job.reason})`,
            );
        });
    }

    private async runPipeline(
        category: ObservationCategory,
        observations: ObservationListResult,
    ): Promise<{
        conclusion: string;
        confidence: string;
        reason: string;
        reasonSignals: string[];
        evidenceReferences: string[];
        considerations: string[];
    }> {
        switch (category) {
            case ObservationCategory.POWER: {
                const evidenceAnalysis = await this.powerAnalysis.analyze(
                    observations,
                );
                const evidenceAssessments = this.evidenceWeighting.analyze(
                    observations,
                    evidenceAnalysis,
                );
                const consolidatedEvidence =
                    this.evidenceConsolidation.consolidate(observations);
                const claimAgreementAnalysis =
                    this.powerClaimAgreement.analyze(consolidatedEvidence);
                const result = await this.powerIntelligence.interpret({
                    observations,
                    evidenceAnalysis,
                    evidenceAssessments,
                    consolidatedEvidence,
                    claimAgreementAnalysis,
                });
                return {
                    conclusion: result.conclusion,
                    confidence: result.confidence,
                    reason: result.reason,
                    reasonSignals: result.reasonSignals,
                    evidenceReferences: result.evidenceReferences,
                    considerations: result.considerations,
                };
            }
            case ObservationCategory.WATER: {
                const evidenceAnalysis = await this.waterAnalysis.analyze(
                    observations,
                );
                const evidenceAssessments = this.evidenceWeighting.analyze(
                    observations,
                    evidenceAnalysis,
                );
                const consolidatedEvidence =
                    this.evidenceConsolidation.consolidate(observations);
                const claimAgreementAnalysis =
                    this.waterClaimAgreement.analyze(consolidatedEvidence);
                const result = await this.waterIntelligence.interpret({
                    observations,
                    evidenceAnalysis,
                    evidenceAssessments,
                    consolidatedEvidence,
                    claimAgreementAnalysis,
                });
                return {
                    conclusion: result.conclusion,
                    confidence: result.confidence,
                    reason: result.reason,
                    reasonSignals: result.reasonSignals,
                    evidenceReferences: result.evidenceReferences,
                    considerations: result.considerations,
                };
            }
            case ObservationCategory.FLOODING: {
                const evidenceAnalysis = await this.floodingAnalysis.analyze(
                    observations,
                );
                const evidenceAssessments = this.evidenceWeighting.analyze(
                    observations,
                    evidenceAnalysis,
                );
                const consolidatedEvidence =
                    this.evidenceConsolidation.consolidate(observations);
                const claimAgreementAnalysis =
                    this.floodingClaimAgreement.analyze(consolidatedEvidence);
                const result = await this.floodingIntelligence.interpret({
                    observations,
                    evidenceAnalysis,
                    evidenceAssessments,
                    consolidatedEvidence,
                    claimAgreementAnalysis,
                });
                return {
                    conclusion: result.conclusion,
                    confidence: result.confidence,
                    reason: result.reason,
                    reasonSignals: result.reasonSignals,
                    evidenceReferences: result.evidenceReferences,
                    considerations: result.considerations,
                };
            }

            case ObservationCategory.SECURITY: {
                const evidenceAnalysis = await this.securityAnalysis.analyze(
                    observations,
                );
                const evidenceAssessments = this.evidenceWeighting.analyze(
                    observations,
                    evidenceAnalysis,
                );
                const consolidatedEvidence =
                    this.evidenceConsolidation.consolidate(observations);
                const claimAgreementAnalysis =
                    this.securityClaimAgreement.analyze(consolidatedEvidence);
                const result = await this.securityIntelligence.interpret({
                    observations,
                    evidenceAnalysis,
                    evidenceAssessments,
                    consolidatedEvidence,
                    claimAgreementAnalysis,
                });
                return {
                    conclusion: result.conclusion,
                    confidence: result.confidence,
                    reason: result.reason,
                    reasonSignals: result.reasonSignals,
                    evidenceReferences: result.evidenceReferences,
                    considerations: result.considerations,
                };
            }

            case ObservationCategory.INTERNET: {
                const evidenceAnalysis = await this.internetAnalysis.analyze(
                    observations,
                );
                const evidenceAssessments = this.evidenceWeighting.analyze(
                    observations,
                    evidenceAnalysis,
                );
                const consolidatedEvidence =
                    this.evidenceConsolidation.consolidate(observations);
                const claimAgreementAnalysis =
                    this.internetClaimAgreement.analyze(consolidatedEvidence);
                const result = await this.internetIntelligence.interpret({
                    observations,
                    evidenceAnalysis,
                    evidenceAssessments,
                    consolidatedEvidence,
                    claimAgreementAnalysis,
                });
                return {
                    conclusion: result.conclusion,
                    confidence: result.confidence,
                    reason: result.reason,
                    reasonSignals: result.reasonSignals,
                    evidenceReferences: result.evidenceReferences,
                    considerations: result.considerations,
                };
            }

            case ObservationCategory.SANITATION: {
                const evidenceAnalysis = await this.sanitationAnalysis.analyze(
                    observations,
                );
                const evidenceAssessments = this.evidenceWeighting.analyze(
                    observations,
                    evidenceAnalysis,
                );
                const consolidatedEvidence =
                    this.evidenceConsolidation.consolidate(observations);
                const claimAgreementAnalysis =
                    this.sanitationClaimAgreement.analyze(consolidatedEvidence);
                const result = await this.sanitationIntelligence.interpret({
                    observations,
                    evidenceAnalysis,
                    evidenceAssessments,
                    consolidatedEvidence,
                    claimAgreementAnalysis,
                });
                return {
                    conclusion: result.conclusion,
                    confidence: result.confidence,
                    reason: result.reason,
                    reasonSignals: result.reasonSignals,
                    evidenceReferences: result.evidenceReferences,
                    considerations: result.considerations,
                };
            }

            case ObservationCategory.ROAD_ACCESS: {
                const evidenceAnalysis = await this.roadAccessAnalysis.analyze(
                    observations,
                );
                const evidenceAssessments = this.evidenceWeighting.analyze(
                    observations,
                    evidenceAnalysis,
                );
                const consolidatedEvidence =
                    this.evidenceConsolidation.consolidate(observations);
                const claimAgreementAnalysis =
                    this.roadAccessClaimAgreement.analyze(consolidatedEvidence);
                const result = await this.roadAccessIntelligence.interpret({
                    observations,
                    evidenceAnalysis,
                    evidenceAssessments,
                    consolidatedEvidence,
                    claimAgreementAnalysis,
                });
                return {
                    conclusion: result.conclusion,
                    confidence: result.confidence,
                    reason: result.reason,
                    reasonSignals: result.reasonSignals,
                    evidenceReferences: result.evidenceReferences,
                    considerations: result.considerations,
                };
            }

            case ObservationCategory.BUILDING_CONDITION: {
                const evidenceAnalysis =
                    await this.buildingConditionAnalysis.analyze(observations);
                const evidenceAssessments = this.evidenceWeighting.analyze(
                    observations,
                    evidenceAnalysis,
                );
                const consolidatedEvidence =
                    this.evidenceConsolidation.consolidate(observations);
                const claimAgreementAnalysis =
                    this.buildingConditionClaimAgreement.analyze(
                        consolidatedEvidence,
                    );
                const result = await this.buildingConditionIntelligence.interpret({
                    observations,
                    evidenceAnalysis,
                    evidenceAssessments,
                    consolidatedEvidence,
                    claimAgreementAnalysis,
                });
                return {
                    conclusion: result.conclusion,
                    confidence: result.confidence,
                    reason: result.reason,
                    reasonSignals: result.reasonSignals,
                    evidenceReferences: result.evidenceReferences,
                    considerations: result.considerations,
                };
            }

            default:
                throw new Error(
                    `Unsupported category for recompute: ${category}`,
                );
        }
    }
}