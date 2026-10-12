
import { Inject, Injectable } from '@nestjs/common';

import type { IntelligenceConclusion } from './types/intelligence-conclusion.type.js';
import type { PowerIntelligenceInput } from './types/power-intelligence-input.type.js';
import type { IntelligenceInterpreter } from './types/intelligence-interpreter.type.js';

import { IntelligenceConclusionValidationService } from './intelligence-conclusion-validation.service.js';

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

        return this.conclusionValidation.validate(
            result,
            validObservationIds,
        );
    }
}
