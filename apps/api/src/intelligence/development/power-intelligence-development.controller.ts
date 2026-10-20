import {
    Controller,
    Param,
    Post,
} from '@nestjs/common';

import { PowerIntelligenceRunner } from './power-intelligence.runner.js';
import { powerObservationScenarios } from './fixtures/power-observation.scenarios.js';

@Controller('development/intelligence/power')
export class PowerIntelligenceDevelopmentController {
    constructor(
        private readonly runner: PowerIntelligenceRunner,
    ) {}

    @Post(':scenario')
    async runScenario(
        @Param('scenario') scenario: string,
    ) {
        if (
            !Object.prototype.hasOwnProperty.call(
                powerObservationScenarios,
                scenario,
            )
        ) {
            return {
                error: 'Invalid power observation scenario.',
                availableScenarios: Object.keys(powerObservationScenarios),
            };
        }

        return this.runner.run(
            scenario as keyof typeof powerObservationScenarios,
        );
    }
}