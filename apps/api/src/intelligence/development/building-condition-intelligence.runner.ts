import { Inject, Injectable } from '@nestjs/common';

import { EvidenceWeightingService } from '../evidence/evidence-weighting.service.js';
import { BuildingConditionIntelligenceService } from '../building-condition-intelligence.service.js';
import { EvidenceConsolidationService } from '../consolidation/evidence-consolidation.service.js';
import { BuildingConditionClaimAgreementAnalysisService } from '../consolidation/strategies/building-condition-claim-agreement-analysis.service.js';
import { BuildingConditionEvidenceAnalysisService } from '../evidence/building-condition-evidence-analysis.service.js';

import { buildingConditionObservationScenarios } from './fixtures/building-condition-observation.scenarios.js';

import type { IntelligenceConclusion } from '../types/intelligence-conclusion.type.js';
import type { BuildingConditionIntelligenceInput } from '../types/building-condition-intelligence-input.type.js';

type BuildingConditionObservationScenarioName =
    keyof typeof buildingConditionObservationScenarios;

@Injectable()
export class BuildingConditionIntelligenceRunner {
    constructor(
        @Inject(BuildingConditionEvidenceAnalysisService)
        private readonly buildingConditionEvidenceAnalysisService: BuildingConditionEvidenceAnalysisService,

        @Inject(EvidenceWeightingService)
        private readonly evidenceWeightingService: EvidenceWeightingService,

        @Inject(BuildingConditionIntelligenceService)
        private readonly buildingConditionIntelligenceService: BuildingConditionIntelligenceService,

        @Inject(EvidenceConsolidationService)
        private readonly evidenceConsolidationService: EvidenceConsolidationService,

        @Inject(BuildingConditionClaimAgreementAnalysisService)
        private readonly buildingConditionClaimAgreementAnalysisService: BuildingConditionClaimAgreementAnalysisService,
    ) {}

    async run(
        scenarioName: BuildingConditionObservationScenarioName,
    ): Promise<IntelligenceConclusion> {
        const observations = [
            ...buildingConditionObservationScenarios[scenarioName],
        ];

        const evidenceAnalysis =
            await this.buildingConditionEvidenceAnalysisService.analyze(
                observations,
            );

        const evidenceAssessments = this.evidenceWeightingService.analyze(
            observations,
            evidenceAnalysis,
        );

        const consolidatedEvidence =
            this.evidenceConsolidationService.consolidate(observations);

        const claimAgreementAnalysis =
            this.buildingConditionClaimAgreementAnalysisService.analyze(
                consolidatedEvidence,
            );

        const input: BuildingConditionIntelligenceInput = {
            observations,
            evidenceAnalysis,
            evidenceAssessments,
            consolidatedEvidence,
            claimAgreementAnalysis,
        };

        return this.buildingConditionIntelligenceService.interpret(input);
    }
}