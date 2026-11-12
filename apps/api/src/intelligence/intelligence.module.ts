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

// NEW — water imports
import { WaterAgreementService } from './evidence/water-agreement.service.js';
import { WaterEvidenceAnalysisService } from './evidence/water-evidence-analysis.service.js';
import { WaterEvidenceConsolidator } from './consolidation/strategies/water-evidence-consolidator.service.js';
import { WaterClaimAgreementService } from './consolidation/strategies/water-claim-agreement.service.js';
import {
    WaterIntelligenceService,
    WATER_INTELLIGENCE_INTERPRETER,
} from './water-intelligence.service.js';
import { WaterIntelligencePrompt } from './prompts/water-intelligence.prompt.js';
import { GeminiWaterIntelligenceInterpreter } from './interpreters/gemini-water-intelligence.interpreter.js';
import { WaterIntelligenceRunner } from './development/water-intelligence.runner.js';

import { WaterClaimAgreementClassifier } from './consolidation/strategies/water-claim-agreement.classifier.js';
import { WaterClaimAgreementAnalysisService } from './consolidation/strategies/water-claim-agreement-analysis.service.js';

import { FloodingAgreementService } from './evidence/flooding-agreement.service.js';
import { FloodingAgreementClassifier } from './evidence/flooding-agreement.classifier.js';
import { FloodingEvidenceAnalysisService } from './evidence/flooding-evidence-analysis.service.js';
import { FloodingEvidenceConsolidator } from './consolidation/strategies/flooding-evidence-consolidator.service.js';
import { FloodingClaimAgreementService } from './consolidation/strategies/flooding-claim-agreement.service.js';
import { FloodingClaimAgreementClassifier } from './consolidation/strategies/flooding-claim-agreement.classifier.js';
import { FloodingClaimAgreementAnalysisService } from './consolidation/strategies/flooding-claim-agreement-analysis.service.js';
import {
    FloodingIntelligenceService,
    FLOODING_INTELLIGENCE_INTERPRETER,
} from './flooding-intelligence.service.js';
import { FloodingIntelligencePrompt } from './prompts/flooding-intelligence.prompt.js';
import { GeminiFloodingIntelligenceInterpreter } from './interpreters/gemini-flooding-intelligence.interpreter.js';
import { ConfidenceCalibrationService } from './confidence/confidence-calibration.service.js';

import { SecurityAgreementService } from './evidence/security-agreement.service.js';
import { SecurityAgreementClassifier } from './evidence/security-agreement.classifier.js';
import { SecurityEvidenceAnalysisService } from './evidence/security-evidence-analysis.service.js';
import { SecurityEvidenceConsolidator } from './consolidation/strategies/security-evidence-consolidator.service.js';
import { SecurityClaimAgreementService } from './consolidation/strategies/security-claim-agreement.service.js';
import { SecurityClaimAgreementClassifier } from './consolidation/strategies/security-claim-agreement.classifier.js';
import { SecurityClaimAgreementAnalysisService } from './consolidation/strategies/security-claim-agreement-analysis.service.js';
import {
    SecurityIntelligenceService,
    SECURITY_INTELLIGENCE_INTERPRETER,
} from './security-intelligence.service.js';
import { SecurityIntelligencePrompt } from './prompts/security-intelligence.prompt.js';
import { GeminiSecurityIntelligenceInterpreter } from './interpreters/gemini-security-intelligence.interpreter.js';

import { InternetAgreementService } from './evidence/internet-agreement.service.js';
import { InternetEvidenceAnalysisService } from './evidence/internet-evidence-analysis.service.js';
import { InternetEvidenceConsolidator } from './consolidation/strategies/internet-evidence-consolidator.service.js';
import { InternetClaimAgreementService } from './consolidation/strategies/internet-claim-agreement.service.js';
import { InternetClaimAgreementClassifier } from './consolidation/strategies/internet-claim-agreement.classifier.js';
import { InternetClaimAgreementAnalysisService } from './consolidation/strategies/internet-claim-agreement-analysis.service.js';
import {
    InternetIntelligenceService,
    INTERNET_INTELLIGENCE_INTERPRETER,
} from './internet-intelligence.service.js';
import { InternetIntelligencePrompt } from './prompts/internet-intelligence.prompt.js';
import { GeminiInternetIntelligenceInterpreter } from './interpreters/gemini-internet-intelligence.interpreter.js';

import { SanitationAgreementService } from './evidence/sanitation-agreement.service.js';
import { SanitationAgreementClassifier } from './evidence/sanitation-agreement.classifier.js';
import { SanitationEvidenceAnalysisService } from './evidence/sanitation-evidence-analysis.service.js';
import { SanitationEvidenceConsolidator } from './consolidation/strategies/sanitation-evidence-consolidator.service.js';
import { SanitationClaimAgreementService } from './consolidation/strategies/sanitation-claim-agreement.service.js';
import { SanitationClaimAgreementClassifier } from './consolidation/strategies/sanitation-claim-agreement.classifier.js';
import { SanitationClaimAgreementAnalysisService } from './consolidation/strategies/sanitation-claim-agreement-analysis.service.js';
import {
    SanitationIntelligenceService,
    SANITATION_INTELLIGENCE_INTERPRETER,
} from './sanitation-intelligence.service.js';
import { SanitationIntelligencePrompt } from './prompts/sanitation-intelligence.prompt.js';
import { GeminiSanitationIntelligenceInterpreter } from './interpreters/gemini-sanitation-intelligence.interpreter.js';

import { RoadAccessAgreementService } from './evidence/road-access-agreement.service.js';
import { RoadAccessAgreementClassifier } from './evidence/road-access-agreement.classifier.js';
import { RoadAccessEvidenceAnalysisService } from './evidence/road-access-evidence-analysis.service.js';
import { RoadAccessEvidenceConsolidator } from './consolidation/strategies/road-access-evidence-consolidator.service.js';
import { RoadAccessClaimAgreementService } from './consolidation/strategies/road-access-claim-agreement.service.js';
import { RoadAccessClaimAgreementClassifier } from './consolidation/strategies/road-access-claim-agreement.classifier.js';
import { RoadAccessClaimAgreementAnalysisService } from './consolidation/strategies/road-access-claim-agreement-analysis.service.js';
import {
    RoadAccessIntelligenceService,
    ROAD_ACCESS_INTELLIGENCE_INTERPRETER,
} from './road-access-intelligence.service.js';
import { RoadAccessIntelligencePrompt } from './prompts/road-access-intelligence.prompt.js';
import { GeminiRoadAccessIntelligenceInterpreter } from './interpreters/gemini-road-access-intelligence.interpreter.js';


import { BuildingConditionAgreementService } from './evidence/building-condition-agreement.service.js';
import { BuildingConditionAgreementClassifier } from './evidence/building-condition-agreement.classifier.js';
import { BuildingConditionEvidenceAnalysisService } from './evidence/building-condition-evidence-analysis.service.js';
import { BuildingConditionEvidenceConsolidator } from './consolidation/strategies/building-condition-evidence-consolidator.service.js';
import { BuildingConditionClaimAgreementService } from './consolidation/strategies/building-condition-claim-agreement.service.js';
import { BuildingConditionClaimAgreementClassifier } from './consolidation/strategies/building-condition-claim-agreement.classifier.js';
import { BuildingConditionClaimAgreementAnalysisService } from './consolidation/strategies/building-condition-claim-agreement-analysis.service.js';
import {
    BuildingConditionIntelligenceService,
    BUILDING_CONDITION_INTELLIGENCE_INTERPRETER,
} from './building-condition-intelligence.service.js';
import { BuildingConditionIntelligencePrompt } from './prompts/building-condition-intelligence.prompt.js';
import { GeminiBuildingConditionIntelligenceInterpreter } from './interpreters/gemini-building-condition-intelligence.interpreter.js';

import { IntelligenceSummaryService } from './summary/intelligence-summary.service.js';
import { IntelligenceSummaryPrompt } from './summary/prompts/intelligence-summary.prompt.js';
import { IntelligenceSummaryValidationService } from './summary/intelligence-summary.validation.js';

import { IntelligenceRepository } from './intelligence.repository.js';

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
        WaterAgreementService,
        WaterEvidenceAnalysisService,
        WaterEvidenceConsolidator,
        WaterClaimAgreementService,
        WaterIntelligenceService,
        WaterIntelligencePrompt,
        GeminiWaterIntelligenceInterpreter,
        WaterIntelligenceRunner,
        WaterClaimAgreementClassifier,
        WaterClaimAgreementAnalysisService,

        {
            provide: EVIDENCE_CONSOLIDATION_STRATEGIES,
            useFactory: (
                powerEvidenceConsolidator: PowerEvidenceConsolidator,
                waterEvidenceConsolidator: WaterEvidenceConsolidator,
                floodingEvidenceConsolidator: FloodingEvidenceConsolidator,
                securityEvidenceConsolidator: SecurityEvidenceConsolidator,
                internetEvidenceConsolidator: InternetEvidenceConsolidator,
                sanitationEvidenceConsolidator: SanitationEvidenceConsolidator,
                roadAccessEvidenceConsolidator: RoadAccessEvidenceConsolidator,
                buildingConditionEvidenceConsolidator: BuildingConditionEvidenceConsolidator,
            ) => [
                    powerEvidenceConsolidator,
                    waterEvidenceConsolidator,
                    floodingEvidenceConsolidator,
                    securityEvidenceConsolidator,
                    internetEvidenceConsolidator,
                    sanitationEvidenceConsolidator,
                    roadAccessEvidenceConsolidator,
                    buildingConditionEvidenceConsolidator,
                ],
            inject: [
                PowerEvidenceConsolidator,
                WaterEvidenceConsolidator,
                FloodingEvidenceConsolidator,
                SecurityEvidenceConsolidator,
                InternetEvidenceConsolidator,
                SanitationEvidenceConsolidator,
                RoadAccessEvidenceConsolidator,
                BuildingConditionEvidenceConsolidator,
            ],
        },

        GeminiClient,
        GeminiPowerIntelligenceInterpreter,
        {
            provide: POWER_INTELLIGENCE_INTERPRETER,
            useExisting: GeminiPowerIntelligenceInterpreter,
        },

        {
            provide: WATER_INTELLIGENCE_INTERPRETER,
            useExisting: GeminiWaterIntelligenceInterpreter,
        },

        FloodingAgreementService,
        FloodingAgreementClassifier,
        FloodingEvidenceAnalysisService,
        FloodingEvidenceConsolidator,
        FloodingClaimAgreementService,
        FloodingClaimAgreementClassifier,
        FloodingClaimAgreementAnalysisService,
        FloodingIntelligenceService,
        FloodingIntelligencePrompt,
        GeminiFloodingIntelligenceInterpreter,
        {
            provide: FLOODING_INTELLIGENCE_INTERPRETER,
            useExisting: GeminiFloodingIntelligenceInterpreter,
        },

        InternetAgreementService,
        InternetEvidenceAnalysisService,
        InternetEvidenceConsolidator,
        InternetClaimAgreementService,
        InternetClaimAgreementClassifier,
        InternetClaimAgreementAnalysisService,
        InternetIntelligenceService,
        InternetIntelligencePrompt,
        GeminiInternetIntelligenceInterpreter,
        {
            provide: INTERNET_INTELLIGENCE_INTERPRETER,
            useExisting: GeminiInternetIntelligenceInterpreter,
        },

        SanitationAgreementService,
        SanitationAgreementClassifier,
        SanitationEvidenceAnalysisService,
        SanitationEvidenceConsolidator,
        SanitationClaimAgreementService,
        SanitationClaimAgreementClassifier,
        SanitationClaimAgreementAnalysisService,
        SanitationIntelligenceService,
        SanitationIntelligencePrompt,
        GeminiSanitationIntelligenceInterpreter,
        {
            provide: SANITATION_INTELLIGENCE_INTERPRETER,
            useExisting: GeminiSanitationIntelligenceInterpreter,
        },
        ConfidenceCalibrationService,

        SecurityAgreementService,
        SecurityAgreementClassifier,
        SecurityEvidenceAnalysisService,
        SecurityEvidenceConsolidator,
        SecurityClaimAgreementService,
        SecurityClaimAgreementClassifier,
        SecurityClaimAgreementAnalysisService,
        SecurityIntelligenceService,
        SecurityIntelligencePrompt,
        GeminiSecurityIntelligenceInterpreter,
        {
            provide: SECURITY_INTELLIGENCE_INTERPRETER,
            useExisting: GeminiSecurityIntelligenceInterpreter,
        },

        RoadAccessAgreementService,
        RoadAccessAgreementClassifier,
        RoadAccessEvidenceAnalysisService,
        RoadAccessEvidenceConsolidator,
        RoadAccessClaimAgreementService,
        RoadAccessClaimAgreementClassifier,
        RoadAccessClaimAgreementAnalysisService,
        RoadAccessIntelligenceService,
        RoadAccessIntelligencePrompt,
        GeminiRoadAccessIntelligenceInterpreter,
        {
            provide: ROAD_ACCESS_INTELLIGENCE_INTERPRETER,
            useExisting: GeminiRoadAccessIntelligenceInterpreter,
        },

        BuildingConditionAgreementService,
        BuildingConditionAgreementClassifier,
        BuildingConditionEvidenceAnalysisService,
        BuildingConditionEvidenceConsolidator,
        BuildingConditionClaimAgreementService,
        BuildingConditionClaimAgreementClassifier,
        BuildingConditionClaimAgreementAnalysisService,
        BuildingConditionIntelligenceService,
        BuildingConditionIntelligencePrompt,
        GeminiBuildingConditionIntelligenceInterpreter,
        {
            provide: BUILDING_CONDITION_INTELLIGENCE_INTERPRETER,
            useExisting: GeminiBuildingConditionIntelligenceInterpreter,
        },
        IntelligenceSummaryPrompt,
        IntelligenceSummaryValidationService,
        IntelligenceSummaryService,
        IntelligenceRepository,
    ],
    exports: [
        IntelligenceService,
        ObservationInterpretationService,
        EvidenceAnalysisService,
        PowerIntelligenceService,
        EvidenceConsolidationService,
        PowerClaimAgreementAnalysisService,
        WaterEvidenceAnalysisService,
        WaterIntelligenceService,
        WaterClaimAgreementAnalysisService,
        FloodingEvidenceAnalysisService,
        FloodingClaimAgreementAnalysisService,
        FloodingIntelligenceService,
        EvidenceWeightingService,
        SecurityEvidenceAnalysisService,
        SecurityClaimAgreementAnalysisService,
        SecurityIntelligenceService,
        InternetEvidenceAnalysisService,
        InternetClaimAgreementAnalysisService,
        InternetIntelligenceService,
        SanitationEvidenceAnalysisService,
        SanitationClaimAgreementAnalysisService,
        SanitationIntelligenceService,
        RoadAccessEvidenceAnalysisService,
        RoadAccessClaimAgreementAnalysisService,
        RoadAccessIntelligenceService,
        BuildingConditionEvidenceAnalysisService,
        BuildingConditionClaimAgreementAnalysisService,
        BuildingConditionIntelligenceService,
        IntelligenceSummaryService,
        IntelligenceRepository,
    ],
})
export class IntelligenceModule { }