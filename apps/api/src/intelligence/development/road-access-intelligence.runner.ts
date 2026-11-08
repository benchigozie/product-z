import { Inject, Injectable } from '@nestjs/common';

import { EvidenceWeightingService } from '../evidence/evidence-weighting.service.js';
import { RoadAccessIntelligenceService } from '../road-access-intelligence.service.js';
import { EvidenceConsolidationService } from '../consolidation/evidence-consolidation.service.js';
import { RoadAccessClaimAgreementAnalysisService } from '../consolidation/strategies/road-access-claim-agreement-analysis.service.js';
import { RoadAccessEvidenceAnalysisService } from '../evidence/road-access-evidence-analysis.service.js';

import { roadAccessObservationScenarios } from './fixtures/road-access-observation.scenarios.js';

import type { IntelligenceConclusion } from '../types/intelligence-conclusion.type.js';
import type { RoadAccessIntelligenceInput } from '../types/road-access-intelligence-input.type.js';

type RoadAccessObservationScenarioName =
    keyof typeof roadAccessObservationScenarios;

@Injectable()
export class RoadAccessIntelligenceRunner {
    constructor(
        @Inject(RoadAccessEvidenceAnalysisService)
        private readonly roadAccessEvidenceAnalysisService: RoadAccessEvidenceAnalysisService,

        @Inject(EvidenceWeightingService)
        private readonly evidenceWeightingService: EvidenceWeightingService,

        @Inject(RoadAccessIntelligenceService)
        private readonly roadAccessIntelligenceService: RoadAccessIntelligenceService,

        @Inject(EvidenceConsolidationService)
        private readonly evidenceConsolidationService: EvidenceConsolidationService,

        @Inject(RoadAccessClaimAgreementAnalysisService)
        private readonly roadAccessClaimAgreementAnalysisService: RoadAccessClaimAgreementAnalysisService,
    ) {}

    async run(
        scenarioName: RoadAccessObservationScenarioName,
    ): Promise<IntelligenceConclusion> {
        const observations = [
            ...roadAccessObservationScenarios[scenarioName],
        ];

        const evidenceAnalysis =
            await this.roadAccessEvidenceAnalysisService.analyze(observations);

        const evidenceAssessments = this.evidenceWeightingService.analyze(
            observations,
            evidenceAnalysis,
        );

        const consolidatedEvidence =
            this.evidenceConsolidationService.consolidate(observations);

        const claimAgreementAnalysis =
            this.roadAccessClaimAgreementAnalysisService.analyze(
                consolidatedEvidence,
            );

        const input: RoadAccessIntelligenceInput = {
            observations,
            evidenceAnalysis,
            evidenceAssessments,
            consolidatedEvidence,
            claimAgreementAnalysis,
        };

        return this.roadAccessIntelligenceService.interpret(input);
    }
}