import {
    Controller,
    Param,
    Post,
} from '@nestjs/common';

import { WaterIntelligenceRunner } from './water-intelligence.runner.js';
import { waterObservationScenarios } from './fixtures/water-observation.scenarios.js';

@Controller('development/intelligence/water')
export class WaterIntelligenceDevelopmentController {
    constructor(
        private readonly runner: WaterIntelligenceRunner,
    ) {}

    @Post(':scenario')
    async runScenario(
        @Param('scenario') scenario: string,
    ) {
        if (
            !Object.prototype.hasOwnProperty.call(
                waterObservationScenarios,
                scenario,
            )
        ) {
            return {
                error: 'Invalid water observation scenario.',
                availableScenarios: Object.keys(waterObservationScenarios),
            };
        }

        return this.runner.run(
            scenario as keyof typeof waterObservationScenarios,
        );
    }
}