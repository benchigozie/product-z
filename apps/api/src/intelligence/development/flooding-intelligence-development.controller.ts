import {
    Controller,
    Param,
    Post,
} from '@nestjs/common';

import { FloodingIntelligenceRunner } from './flooding-intelligence.runner.js';
import { floodingObservationScenarios } from './fixtures/flooding-observation.scenarios.js';

@Controller('development/intelligence/flooding')
export class FloodingIntelligenceDevelopmentController {
    constructor(
        private readonly runner: FloodingIntelligenceRunner,
    ) {}

    @Post(':scenario')
    async runScenario(
        @Param('scenario') scenario: string,
    ) {
        if (
            !Object.prototype.hasOwnProperty.call(
                floodingObservationScenarios,
                scenario,
            )
        ) {
            return {
                error: 'Invalid flooding observation scenario.',
                availableScenarios: Object.keys(floodingObservationScenarios),
            };
        }

        return this.runner.run(
            scenario as keyof typeof floodingObservationScenarios,
        );
    }
}