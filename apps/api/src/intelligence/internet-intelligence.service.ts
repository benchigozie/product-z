import { Inject, Injectable } from '@nestjs/common';

import type { IntelligenceConclusion } from './types/intelligence-conclusion.type.js';
import type { InternetIntelligenceInput } from './types/internet-intelligence-input.type.js';
import type { IntelligenceInterpreter } from './types/intelligence-interpreter.type.js';

import { IntelligenceConclusionValidationService } from './intelligence-conclusion-validation.service.js';
import { ConfidenceCalibrationService } from './confidence/confidence-calibration.service.js';
import { IntelligenceConfidence } from './enums/intelligence-confidence.enum.js';
import { ConclusionState } from './enums/conclusion-state.enum.js';
import { EvidenceRecencyClassification } from './evidence/evidence-recency.classification.js';
import { ObservationCategory } from '../observation/enums/observation-category.enum.js';
import { internetToConclusionState } from './utils/condition-mapper.js';
import { InternetCondition } from './enums/internet-condition.enum.js';

export const INTERNET_INTELLIGENCE_INTERPRETER = Symbol(
    'INTERNET_INTELLIGENCE_INTERPRETER',
);

@Injectable()
export class InternetIntelligenceService {
    constructor(
        @Inject(INTERNET_INTELLIGENCE_INTERPRETER)
        private readonly interpreter: IntelligenceInterpreter<InternetIntelligenceInput>,
        private readonly conclusionValidation: IntelligenceConclusionValidationService,
        private readonly confidenceCalibration: ConfidenceCalibrationService,
    ) {}

    async interpret(
        input: InternetIntelligenceInput,
    ): Promise<IntelligenceConclusion> {
        const result = await this.interpreter.interpret(input);

        const validObservationIds = new Set(
            input.observations.map((observation) => observation.id),
        );

        const validated = await this.conclusionValidation.validate(
            result,
            validObservationIds,
            ObservationCategory.INTERNET,
        );

        const recency = input.evidenceAnalysis.recency;

        const allEvidenceIsOld =
            recency.length > 0 &&
            recency.every(
                (item) =>
                    item.classification === EvidenceRecencyClassification.OLD,
            );

        if (allEvidenceIsOld) {
            const overrideConfidence =
                this.confidenceCalibration.calibrate(
                    ConclusionState.UNRESOLVED,
                    IntelligenceConfidence.LOW,
                    input.evidenceAnalysis,
                );

            return {
                conclusion: ConclusionState.UNRESOLVED,
                confidence: overrideConfidence,
                reason:
                    'Insufficient recent evidence to determine the current internet condition.',
                reasonSignals: ['All available observations are old'],
                evidenceReferences: validated.evidenceReferences,
                considerations: [
                    'Agreement between old observations cannot establish the current condition.',
                ],
            };
        }

        // Safe: validator confirmed the conclusion is a valid InternetCondition
        // (via category check in IntelligenceConclusionValidationService).
        const mappedConclusion = internetToConclusionState(
            validated.conclusion as unknown as InternetCondition,
        );

        const calibratedConfidence = this.confidenceCalibration.calibrate(
            mappedConclusion,
            validated.confidence,
            input.evidenceAnalysis,
        );

        return {
            ...validated,
            conclusion: mappedConclusion,
            confidence: calibratedConfidence,
        };
    }
}