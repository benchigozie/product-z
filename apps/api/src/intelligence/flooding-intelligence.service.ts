import { Inject, Injectable } from '@nestjs/common';

import type { IntelligenceConclusion } from './types/intelligence-conclusion.type.js';
import type { FloodingIntelligenceInput } from './types/flooding-intelligence-input.type.js';
import type { IntelligenceInterpreter } from './types/intelligence-interpreter.type.js';

import { IntelligenceConclusionValidationService } from './intelligence-conclusion-validation.service.js';
import { FloodingCondition } from './enums/flooding-condition.enum.js';
import { IntelligenceConfidence } from './enums/intelligence-confidence.enum.js';
import { EvidenceRecencyClassification } from './evidence/evidence-recency.classification.js';

export const FLOODING_INTELLIGENCE_INTERPRETER = Symbol(
    'FLOODING_INTELLIGENCE_INTERPRETER',
);

@Injectable()
export class FloodingIntelligenceService {
    constructor(
        @Inject(FLOODING_INTELLIGENCE_INTERPRETER)
        private readonly interpreter: IntelligenceInterpreter<FloodingIntelligenceInput>,
        private readonly conclusionValidation: IntelligenceConclusionValidationService,
    ) {}

    async interpret(
        input: FloodingIntelligenceInput,
    ): Promise<IntelligenceConclusion> {
        const result = await this.interpreter.interpret(input);

        const validObservationIds = new Set(
            input.observations.map((observation) => observation.id),
        );

        const conclusion = await this.conclusionValidation.validate(
            result,
            validObservationIds,
        );

        const recency = input.evidenceAnalysis.recency;

        const allEvidenceIsOld =
            recency.length > 0 &&
            recency.every(
                (item) =>
                    item.classification === EvidenceRecencyClassification.OLD,
            );

        if (allEvidenceIsOld) {
            return {
                ...conclusion,
                conclusion: FloodingCondition.UNRESOLVED,
                confidence: IntelligenceConfidence.LOW,
                reason:
                    'Insufficient recent evidence to determine the current flooding condition.',
                reasonSignals: ['All available observations are old'],
                considerations: [
                    'Agreement between old observations cannot establish the current condition.',
                ],
            };
        }

        return conclusion;
    }
}