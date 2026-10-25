import { Inject, Injectable } from '@nestjs/common';

import type { IntelligenceConclusion } from './types/intelligence-conclusion.type.js';
import type { FloodingIntelligenceInput } from './types/flooding-intelligence-input.type.js';
import type { IntelligenceInterpreter } from './types/intelligence-interpreter.type.js';

import { IntelligenceConclusionValidationService } from './intelligence-conclusion-validation.service.js';
import { ConfidenceCalibrationService } from './confidence/confidence-calibration.service.js';
import { IntelligenceConfidence } from './enums/intelligence-confidence.enum.js';
import { ConclusionState } from './enums/conclusion-state.enum.js';
import { EvidenceRecencyClassification } from './evidence/evidence-recency.classification.js';
import { ObservationCategory } from '../observation/enums/observation-category.enum.js';
import { floodingToConclusionState } from './utils/condition-mapper.js';
import { FloodingCondition } from './enums/flooding-condition.enum.js';

export const FLOODING_INTELLIGENCE_INTERPRETER = Symbol(
    'FLOODING_INTELLIGENCE_INTERPRETER',
);

@Injectable()
export class FloodingIntelligenceService {
    constructor(
        @Inject(FLOODING_INTELLIGENCE_INTERPRETER)
        private readonly interpreter: IntelligenceInterpreter<FloodingIntelligenceInput>,
        private readonly conclusionValidation: IntelligenceConclusionValidationService,
        private readonly confidenceCalibration: ConfidenceCalibrationService,
    ) {}

    async interpret(
        input: FloodingIntelligenceInput,
    ): Promise<IntelligenceConclusion> {
        const result = await this.interpreter.interpret(input);

        const validObservationIds = new Set(
            input.observations.map((observation) => observation.id),
        );

        const validated = await this.conclusionValidation.validate(
            result,
            validObservationIds,
            ObservationCategory.FLOODING,
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
                    'Insufficient recent evidence to determine the current flooding condition.',
                reasonSignals: ['All available observations are old'],
                evidenceReferences: validated.evidenceReferences,
                considerations: [
                    'Agreement between old observations cannot establish the current condition.',
                ],
            };
        }

        // Safe: validator confirmed the conclusion is a valid FloodingCondition
        // (via category check in IntelligenceConclusionValidationService).
        const mappedConclusion = floodingToConclusionState(
            validated.conclusion as FloodingCondition,
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