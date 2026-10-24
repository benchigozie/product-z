import { Inject, Injectable } from '@nestjs/common';

import { EvidenceWeightingService } from '../evidence/evidence-weighting.service.js';
import { FloodingIntelligenceService } from '../flooding-intelligence.service.js';
import { EvidenceConsolidationService } from '../consolidation/evidence-consolidation.service.js';
import { FloodingClaimAgreementAnalysisService } from '../consolidation/strategies/flooding-claim-agreement-analysis.service.js';
import { FloodingEvidenceAnalysisService } from '../evidence/flooding-evidence-analysis.service.js';

import { floodingObservationScenarios } from './fixtures/flooding-observation.scenarios.js';

import type { IntelligenceConclusion } from '../types/intelligence-conclusion.type.js';
import type { FloodingIntelligenceInput } from '../types/flooding-intelligence-input.type.js';

type FloodingObservationScenarioName = keyof typeof floodingObservationScenarios;

@Injectable()
export class FloodingIntelligenceRunner {
    constructor(
        @Inject(FloodingEvidenceAnalysisService)
        private readonly floodingEvidenceAnalysisService: FloodingEvidenceAnalysisService,

        @Inject(EvidenceWeightingService)
        private readonly evidenceWeightingService: EvidenceWeightingService,

        @Inject(FloodingIntelligenceService)
        private readonly floodingIntelligenceService: FloodingIntelligenceService,

        @Inject(EvidenceConsolidationService)
        private readonly evidenceConsolidationService: EvidenceConsolidationService,

        @Inject(FloodingClaimAgreementAnalysisService)
        private readonly floodingClaimAgreementAnalysisService: FloodingClaimAgreementAnalysisService,
    ) {}

    async run(
        scenarioName: FloodingObservationScenarioName,
    ): Promise<IntelligenceConclusion> {
        const observations = [...floodingObservationScenarios[scenarioName]];

        const evidenceAnalysis =
            await this.floodingEvidenceAnalysisService.analyze(observations);

        const evidenceAssessments =
            this.evidenceWeightingService.analyze(
                observations,
                evidenceAnalysis,
            );

        const consolidatedEvidence =
            this.evidenceConsolidationService.consolidate(observations);

            const claimAgreementAnalysis =
            this.floodingClaimAgreementAnalysisService.analyze(
                consolidatedEvidence,
            );

        const input: FloodingIntelligenceInput = {
            observations,
            evidenceAnalysis,
            evidenceAssessments,
            consolidatedEvidence,
            claimAgreementAnalysis,
        };

        return this.floodingIntelligenceService.interpret(input);
    }
}