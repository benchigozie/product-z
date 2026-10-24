import { Inject, Injectable } from '@nestjs/common';

import type { IntelligenceConclusion } from './types/intelligence-conclusion.type.js';
import type { PowerIntelligenceInput } from './types/power-intelligence-input.type.js';
import type { IntelligenceInterpreter } from './types/intelligence-interpreter.type.js';

import { IntelligenceConclusionValidationService } from './intelligence-conclusion-validation.service.js';
import { IntelligenceConfidence } from './enums/intelligence-confidence.enum.js';
import { ConclusionState } from './enums/conclusion-state.enum.js';
import { EvidenceRecencyClassification } from './evidence/evidence-recency.classification.js';
import { ObservationCategory } from '../observation/enums/observation-category.enum.js';
import { powerToConclusionState } from './utils/condition-mapper.js';
import { PowerCondition } from './enums/power-condition.enum.js';

export const POWER_INTELLIGENCE_INTERPRETER = Symbol(
    'POWER_INTELLIGENCE_INTERPRETER',
);

@Injectable()
export class PowerIntelligenceService {
    constructor(
        @Inject(POWER_INTELLIGENCE_INTERPRETER)
        private readonly interpreter: IntelligenceInterpreter<PowerIntelligenceInput>,
        private readonly conclusionValidation: IntelligenceConclusionValidationService,
    ) {}

    async interpret(
        input: PowerIntelligenceInput,
    ): Promise<IntelligenceConclusion> {
        const result = await this.interpreter.interpret(input);

        const validObservationIds = new Set(
            input.observations.map((observation) => observation.id),
        );

        const validated = await this.conclusionValidation.validate(
            result,
            validObservationIds,
            ObservationCategory.POWER,
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
                conclusion: ConclusionState.UNRESOLVED,
                confidence: IntelligenceConfidence.LOW,
                reason:
                    'Insufficient recent evidence to determine the current electricity condition.',
                reasonSignals: ['All available observations are old'],
                evidenceReferences: validated.evidenceReferences,
                considerations: [
                    'Agreement between old observations cannot establish the current condition.',
                ],
            };
        }

        return {
            ...validated,
            conclusion: powerToConclusionState(validated.conclusion as PowerCondition),
        };
    }
}