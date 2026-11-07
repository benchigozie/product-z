import { Inject, Injectable } from '@nestjs/common';

import { EvidenceWeightingService } from '../evidence/evidence-weighting.service.js';
import { SanitationIntelligenceService } from '../sanitation-intelligence.service.js';
import { EvidenceConsolidationService } from '../consolidation/evidence-consolidation.service.js';
import { SanitationClaimAgreementAnalysisService } from '../consolidation/strategies/sanitation-claim-agreement-analysis.service.js';
import { SanitationEvidenceAnalysisService } from '../evidence/sanitation-evidence-analysis.service.js';

import { sanitationObservationScenarios } from './fixtures/sanitation-observation.scenarios.js';

import type { IntelligenceConclusion } from '../types/intelligence-conclusion.type.js';
import type { SanitationIntelligenceInput } from '../types/sanitation-intelligence-input.type.js';

type SanitationObservationScenarioName =
    keyof typeof sanitationObservationScenarios;

@Injectable()
export class SanitationIntelligenceRunner {
    constructor(
        @Inject(SanitationEvidenceAnalysisService)
        private readonly sanitationEvidenceAnalysisService: SanitationEvidenceAnalysisService,

        @Inject(EvidenceWeightingService)
        private readonly evidenceWeightingService: EvidenceWeightingService,

        @Inject(SanitationIntelligenceService)
        private readonly sanitationIntelligenceService: SanitationIntelligenceService,

        @Inject(EvidenceConsolidationService)
        private readonly evidenceConsolidationService: EvidenceConsolidationService,

        @Inject(SanitationClaimAgreementAnalysisService)
        private readonly sanitationClaimAgreementAnalysisService: SanitationClaimAgreementAnalysisService,
    ) {}

    async run(
        scenarioName: SanitationObservationScenarioName,
    ): Promise<IntelligenceConclusion> {
        const observations = [
            ...sanitationObservationScenarios[scenarioName],
        ];

        const evidenceAnalysis =
            await this.sanitationEvidenceAnalysisService.analyze(observations);

        const evidenceAssessments = this.evidenceWeightingService.analyze(
            observations,
            evidenceAnalysis,
        );

        const consolidatedEvidence =
            this.evidenceConsolidationService.consolidate(observations);

        const claimAgreementAnalysis =
            this.sanitationClaimAgreementAnalysisService.analyze(
                consolidatedEvidence,
            );

        const input: SanitationIntelligenceInput = {
            observations,
            evidenceAnalysis,
            evidenceAssessments,
            consolidatedEvidence,
            claimAgreementAnalysis,
        };

        return this.sanitationIntelligenceService.interpret(input);
    }
}