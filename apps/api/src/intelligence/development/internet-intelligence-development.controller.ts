import { Controller, Param, Post } from '@nestjs/common';

import { InternetIntelligenceRunner } from './internet-intelligence.runner.js';
import { internetObservationScenarios } from './fixtures/internet-observation.scenarios.js';

@Controller('development/intelligence/internet')
export class InternetIntelligenceDevelopmentController {
    constructor(private readonly runner: InternetIntelligenceRunner) {}

    @Post(':scenario')
    async runScenario(@Param('scenario') scenario: string) {
        if (
            !Object.prototype.hasOwnProperty.call(
                internetObservationScenarios,
                scenario,
            )
        ) {
            return {
                error: 'Invalid internet observation scenario.',
                availableScenarios: Object.keys(internetObservationScenarios),
            };
        }

        return this.runner.run(
            scenario as keyof typeof internetObservationScenarios,
        );
    }
}