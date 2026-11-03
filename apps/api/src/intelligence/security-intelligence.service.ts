import { Inject, Injectable } from '@nestjs/common';

import type { IntelligenceConclusion } from './types/intelligence-conclusion.type.js';
import type { SecurityIntelligenceInput } from './types/security-intelligence-input.type.js';
import type { IntelligenceInterpreter } from './types/intelligence-interpreter.type.js';

import { IntelligenceConclusionValidationService } from './intelligence-conclusion-validation.service.js';
import { ConfidenceCalibrationService } from './confidence/confidence-calibration.service.js';
import { IntelligenceConfidence } from './enums/intelligence-confidence.enum.js';
import { ConclusionState } from './enums/conclusion-state.enum.js';
import { EvidenceRecencyClassification } from './evidence/evidence-recency.classification.js';
import { ObservationCategory } from '../observation/enums/observation-category.enum.js';
import { securityToConclusionState } from './utils/condition-mapper.js';
import { SecurityCondition } from './enums/security-condition.enum.js';

export const SECURITY_INTELLIGENCE_INTERPRETER = Symbol(
    'SECURITY_INTELLIGENCE_INTERPRETER',
);

@Injectable()
export class SecurityIntelligenceService {
    constructor(
        @Inject(SECURITY_INTELLIGENCE_INTERPRETER)
        private readonly interpreter: IntelligenceInterpreter<SecurityIntelligenceInput>,
        private readonly conclusionValidation: IntelligenceConclusionValidationService,
        private readonly confidenceCalibration: ConfidenceCalibrationService,
    ) {}

    async interpret(
        input: SecurityIntelligenceInput,
    ): Promise<IntelligenceConclusion> {
        const result = await this.interpreter.interpret(input);

        const validObservationIds = new Set(
            input.observations.map((observation) => observation.id),
        );

        const validated = await this.conclusionValidation.validate(
            result,
            validObservationIds,
            ObservationCategory.SECURITY,
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
                    'Insufficient recent evidence to determine the current security condition.',
                reasonSignals: ['All available observations are old'],
                evidenceReferences: validated.evidenceReferences,
                considerations: [
                    'Agreement between old observations cannot establish the current condition.',
                ],
            };
        }

        // Safe: validator confirmed the conclusion is a valid SecurityCondition
        // (via category check in IntelligenceConclusionValidationService).
        const mappedConclusion = securityToConclusionState(
            validated.conclusion as unknown as SecurityCondition,
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