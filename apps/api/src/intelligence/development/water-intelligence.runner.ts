import { Inject, Injectable } from '@nestjs/common';

import { EvidenceAnalysisService } from '../evidence/evidence-analysis.service.js';
import { EvidenceWeightingService } from '../evidence/evidence-weighting.service.js';
import { WaterIntelligenceService } from '../water-intelligence.service.js';
import { EvidenceConsolidationService } from '../consolidation/evidence-consolidation.service.js';
import { WaterClaimAgreementAnalysisService } from '../consolidation/strategies/water-claim-agreement-analysis.service.js';

import { waterObservationScenarios } from './fixtures/water-observation.scenarios.js';

import type { IntelligenceConclusion } from '../types/intelligence-conclusion.type.js';
import type { WaterIntelligenceInput } from '../types/water-intelligence-input.type.js';

type WaterObservationScenarioName = keyof typeof waterObservationScenarios;

import { WaterEvidenceAnalysisService } from '../evidence/water-evidence-analysis.service.js';



@Injectable()
export class WaterIntelligenceRunner {
    constructor(
        @Inject(EvidenceAnalysisService)
        private readonly evidenceAnalysisService: EvidenceAnalysisService,

        @Inject(EvidenceWeightingService)
        private readonly evidenceWeightingService: EvidenceWeightingService,

        @Inject(WaterIntelligenceService)
        private readonly waterIntelligenceService: WaterIntelligenceService,

        @Inject(EvidenceConsolidationService)
        private readonly evidenceConsolidationService: EvidenceConsolidationService,

        @Inject(WaterClaimAgreementAnalysisService)
        private readonly waterClaimAgreementAnalysisService: WaterClaimAgreementAnalysisService,

        @Inject(WaterEvidenceAnalysisService)
        private readonly waterEvidenceAnalysisService: WaterEvidenceAnalysisService,
    ) { }

    async run(
        scenarioName: WaterObservationScenarioName,
    ): Promise<IntelligenceConclusion> {
        const observations = [...waterObservationScenarios[scenarioName]];


        const evidenceAnalysis = await this.waterEvidenceAnalysisService.analyze(observations);


        const evidenceAssessments =
            this.evidenceWeightingService.analyze(
                observations,
                evidenceAnalysis,
            );

        const consolidatedEvidence =
            this.evidenceConsolidationService.consolidate(observations);

            const powerClaimAgreementAnalysis =
            this.waterClaimAgreementAnalysisService.analyze(
                consolidatedEvidence,
            );

        const input: WaterIntelligenceInput = {
            observations,
            evidenceAnalysis,
            evidenceAssessments,
            consolidatedEvidence,
            powerClaimAgreementAnalysis,
        };

        return this.waterIntelligenceService.interpret(input);
    }
}