import { Module } from '@nestjs/common';

import { IntelligenceService } from './intelligence.service.js';
import { ObservationInterpretationService } from './interpretation/observation-interpretation.service.js';
import { EvidenceAnalysisService } from './evidence/evidence-analysis.service.js';
import { EvidenceRecencyService } from './evidence/evidence-recency.service.js';
import { PowerAgreementService } from './power-agreement.service.js';
import { ObservationDataModule } from '../observation/data/observation-data.module.js';
import { AvailabilityAgreementClassifier } from './availability-agreement.classifier.js';
import {
    PowerIntelligenceService,
    POWER_INTELLIGENCE_INTERPRETER,
} from './power-intelligence.service.js';
import { IntelligenceConclusionValidationService } from './intelligence-conclusion-validation.service.js';
import { GeminiClient } from './llm/gemini.client.js';
import { GeminiPowerIntelligenceInterpreter } from './interpreters/gemini-power-intelligence.interpreter.js';
import { EvidenceWeightingService } from './evidence/evidence-weighting.service.js';
import { EvidenceTemporalAnalysisService } from './evidence/evidence-temporal-analysis.service.js';
import { PowerIntelligencePrompt } from './prompts/power-intelligence.prompt.js';

import {
    EvidenceConsolidationService,
    EVIDENCE_CONSOLIDATION_STRATEGIES,
} from './consolidation/evidence-consolidation.service.js';
import { PowerEvidenceConsolidator } from './consolidation/strategies/power-evidence-consolidator.service.js';
import { PowerClaimAgreementService } from './consolidation/strategies/power-claim-agreement.service.js';
import { PowerClaimAgreementClassifier } from './consolidation/strategies/power-claim-agreement.classifier.js';
import { PowerClaimAgreementAnalysisService } from './consolidation/strategies/power-claim-agreement-analysis.service.js';
import { AvailabilityAgreementService } from './evidence/availability-agreement.service.js';

@Module({
    imports: [
        ObservationDataModule,
    ],
    providers: [
        IntelligenceService,
        ObservationInterpretationService,
        EvidenceAnalysisService,
        EvidenceRecencyService,
        PowerAgreementService,
        AvailabilityAgreementClassifier,
        EvidenceWeightingService,
        EvidenceTemporalAnalysisService,
        IntelligenceConclusionValidationService,
        PowerIntelligenceService,
        PowerClaimAgreementAnalysisService,
        PowerIntelligencePrompt,
        EvidenceConsolidationService,
        PowerEvidenceConsolidator,
        PowerClaimAgreementService,
        PowerClaimAgreementClassifier,
        AvailabilityAgreementService,
        {
            provide: EVIDENCE_CONSOLIDATION_STRATEGIES,
            useFactory: (
                powerEvidenceConsolidator: PowerEvidenceConsolidator,
            ) => [powerEvidenceConsolidator],
            inject: [PowerEvidenceConsolidator],
        },
        GeminiClient,
        GeminiPowerIntelligenceInterpreter,
        {
            provide: POWER_INTELLIGENCE_INTERPRETER,
            useExisting: GeminiPowerIntelligenceInterpreter,
        },
    ],
    exports: [
        IntelligenceService,
        ObservationInterpretationService,
        EvidenceAnalysisService,
        PowerIntelligenceService,
        EvidenceConsolidationService,
        PowerClaimAgreementAnalysisService,
    ],
})
export class IntelligenceModule {}