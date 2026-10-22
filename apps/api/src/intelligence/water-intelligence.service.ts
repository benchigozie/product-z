import { Inject, Injectable } from '@nestjs/common';

import type { IntelligenceConclusion } from './types/intelligence-conclusion.type.js';
import type { WaterIntelligenceInput } from './types/water-intelligence-input.type.js';
import type { IntelligenceInterpreter } from './types/intelligence-interpreter.type.js';

import { IntelligenceConclusionValidationService } from './intelligence-conclusion-validation.service.js';
import { PowerCondition } from './enums/power-condition.enum.js';
import { IntelligenceConfidence } from './enums/intelligence-confidence.enum.js';
import { EvidenceRecencyClassification } from './evidence/evidence-recency.classification.js';

export const WATER_INTELLIGENCE_INTERPRETER = Symbol(
    'WATER_INTELLIGENCE_INTERPRETER',
);

@Injectable()
export class WaterIntelligenceService {
    constructor(
        @Inject(WATER_INTELLIGENCE_INTERPRETER)
        private readonly interpreter: IntelligenceInterpreter<WaterIntelligenceInput>,
        private readonly conclusionValidation: IntelligenceConclusionValidationService,
    ) {}

    async interpret(
        input: WaterIntelligenceInput,
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
                conclusion: PowerCondition.UNRESOLVED,
                confidence: IntelligenceConfidence.LOW,
                reason:
                    'Insufficient recent evidence to determine the current water condition.',
                reasonSignals: ['All available observations are old'],
                considerations: [
                    'Agreement between old observations cannot establish the current condition.',
                ],
            };
        }

        return conclusion;
    }
}