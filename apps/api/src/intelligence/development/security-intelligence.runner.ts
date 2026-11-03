import { Inject, Injectable } from '@nestjs/common';

import { EvidenceWeightingService } from '../evidence/evidence-weighting.service.js';
import { SecurityIntelligenceService } from '../security-intelligence.service.js';
import { EvidenceConsolidationService } from '../consolidation/evidence-consolidation.service.js';
import { SecurityClaimAgreementAnalysisService } from '../consolidation/strategies/security-claim-agreement-analysis.service.js';
import { SecurityEvidenceAnalysisService } from '../evidence/security-evidence-analysis.service.js';

import { securityObservationScenarios } from './fixtures/security-observation.scenarios.js';

import type { IntelligenceConclusion } from '../types/intelligence-conclusion.type.js';
import type { SecurityIntelligenceInput } from '../types/security-intelligence-input.type.js';

type SecurityObservationScenarioName =
    keyof typeof securityObservationScenarios;

@Injectable()
export class SecurityIntelligenceRunner {
    constructor(
        @Inject(SecurityEvidenceAnalysisService)
        private readonly securityEvidenceAnalysisService: SecurityEvidenceAnalysisService,

        @Inject(EvidenceWeightingService)
        private readonly evidenceWeightingService: EvidenceWeightingService,

        @Inject(SecurityIntelligenceService)
        private readonly securityIntelligenceService: SecurityIntelligenceService,

        @Inject(EvidenceConsolidationService)
        private readonly evidenceConsolidationService: EvidenceConsolidationService,

        @Inject(SecurityClaimAgreementAnalysisService)
        private readonly securityClaimAgreementAnalysisService: SecurityClaimAgreementAnalysisService,
    ) {}

    async run(
        scenarioName: SecurityObservationScenarioName,
    ): Promise<IntelligenceConclusion> {
        const observations = [
            ...securityObservationScenarios[scenarioName],
        ];

        const evidenceAnalysis =
            await this.securityEvidenceAnalysisService.analyze(observations);

        const evidenceAssessments = this.evidenceWeightingService.analyze(
            observations,
            evidenceAnalysis,
        );

        const consolidatedEvidence =
            this.evidenceConsolidationService.consolidate(observations);

        const claimAgreementAnalysis =
            this.securityClaimAgreementAnalysisService.analyze(
                consolidatedEvidence,
            );

        const input: SecurityIntelligenceInput = {
            observations,
            evidenceAnalysis,
            evidenceAssessments,
            consolidatedEvidence,
            claimAgreementAnalysis,
        };

        return this.securityIntelligenceService.interpret(input);
    }
}