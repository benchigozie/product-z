import { Inject, Injectable } from '@nestjs/common';

import { EvidenceWeightingService } from '../evidence/evidence-weighting.service.js';
import { InternetIntelligenceService } from '../internet-intelligence.service.js';
import { EvidenceConsolidationService } from '../consolidation/evidence-consolidation.service.js';
import { InternetClaimAgreementAnalysisService } from '../consolidation/strategies/internet-claim-agreement-analysis.service.js';
import { InternetEvidenceAnalysisService } from '../evidence/internet-evidence-analysis.service.js';

import { internetObservationScenarios } from './fixtures/internet-observation.scenarios.js';

import type { IntelligenceConclusion } from '../types/intelligence-conclusion.type.js';
import type { InternetIntelligenceInput } from '../types/internet-intelligence-input.type.js';

type InternetObservationScenarioName =
    keyof typeof internetObservationScenarios;

@Injectable()
export class InternetIntelligenceRunner {
    constructor(
        @Inject(InternetEvidenceAnalysisService)
        private readonly internetEvidenceAnalysisService: InternetEvidenceAnalysisService,

        @Inject(EvidenceWeightingService)
        private readonly evidenceWeightingService: EvidenceWeightingService,

        @Inject(InternetIntelligenceService)
        private readonly internetIntelligenceService: InternetIntelligenceService,

        @Inject(EvidenceConsolidationService)
        private readonly evidenceConsolidationService: EvidenceConsolidationService,

        @Inject(InternetClaimAgreementAnalysisService)
        private readonly internetClaimAgreementAnalysisService: InternetClaimAgreementAnalysisService,
    ) {}

    async run(
        scenarioName: InternetObservationScenarioName,
    ): Promise<IntelligenceConclusion> {
        const observations = [
            ...internetObservationScenarios[scenarioName],
        ];

        const evidenceAnalysis =
            await this.internetEvidenceAnalysisService.analyze(observations);

        const evidenceAssessments = this.evidenceWeightingService.analyze(
            observations,
            evidenceAnalysis,
        );

        const consolidatedEvidence =
            this.evidenceConsolidationService.consolidate(observations);

        const claimAgreementAnalysis =
            this.internetClaimAgreementAnalysisService.analyze(
                consolidatedEvidence,
            );

        const input: InternetIntelligenceInput = {
            observations,
            evidenceAnalysis,
            evidenceAssessments,
            consolidatedEvidence,
            claimAgreementAnalysis,
        };

        return this.internetIntelligenceService.interpret(input);
    }
}