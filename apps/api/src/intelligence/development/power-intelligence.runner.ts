import { Inject, Injectable } from '@nestjs/common';

import { EvidenceAnalysisService } from '../evidence/evidence-analysis.service.js';
import { EvidenceWeightingService } from '../evidence/evidence-weighting.service.js';
import { PowerIntelligenceService } from '../power-intelligence.service.js';
import { EvidenceConsolidationService } from '../consolidation/evidence-consolidation.service.js';
import { PowerClaimAgreementAnalysisService } from '../consolidation/strategies/power-claim-agreement-analysis.service.js';

import { powerObservationScenarios } from './fixtures/power-observation.scenarios.js';

import type { IntelligenceConclusion } from '../types/intelligence-conclusion.type.js';
import type { PowerIntelligenceInput } from '../types/power-intelligence-input.type.js';

type PowerObservationScenarioName = keyof typeof powerObservationScenarios;

@Injectable()
export class PowerIntelligenceRunner {
    constructor(
        @Inject(EvidenceAnalysisService)
        private readonly evidenceAnalysisService: EvidenceAnalysisService,

        @Inject(EvidenceWeightingService)
        private readonly evidenceWeightingService: EvidenceWeightingService,

        @Inject(PowerIntelligenceService)
        private readonly powerIntelligenceService: PowerIntelligenceService,

        @Inject(EvidenceConsolidationService)
        private readonly evidenceConsolidationService: EvidenceConsolidationService,

        @Inject(PowerClaimAgreementAnalysisService)
        private readonly powerClaimAgreementAnalysisService: PowerClaimAgreementAnalysisService,
    ) {}

    async run(
        scenarioName: PowerObservationScenarioName,
    ): Promise<IntelligenceConclusion> {
        const observations = powerObservationScenarios[scenarioName];


        const evidenceAnalysis =
            await this.evidenceAnalysisService.analyze(observations);

        const evidenceAssessments =
            this.evidenceWeightingService.analyze(
                observations,
                evidenceAnalysis,
            );


        const consolidatedEvidence =
            this.evidenceConsolidationService.consolidate(observations);

        const powerClaimAgreementAnalysis =
            this.powerClaimAgreementAnalysisService.analyze(
                consolidatedEvidence,
            );


        const input: PowerIntelligenceInput = {
            observations,
            evidenceAnalysis,
            evidenceAssessments,
            consolidatedEvidence,
            powerClaimAgreementAnalysis,
        };

        return this.powerIntelligenceService.interpret(input);
    }
}