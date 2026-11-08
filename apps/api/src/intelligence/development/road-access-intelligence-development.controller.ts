import { Controller, Param, Post } from '@nestjs/common';

import { RoadAccessIntelligenceRunner } from './road-access-intelligence.runner.js';
import { roadAccessObservationScenarios } from './fixtures/road-access-observation.scenarios.js';

@Controller('development/intelligence/road-access')
export class RoadAccessIntelligenceDevelopmentController {
    constructor(private readonly runner: RoadAccessIntelligenceRunner) {}

    @Post(':scenario')
    async runScenario(@Param('scenario') scenario: string) {
        if (
            !Object.prototype.hasOwnProperty.call(
                roadAccessObservationScenarios,
                scenario,
            )
        ) {
            return {
                error: 'Invalid road access observation scenario.',
                availableScenarios: Object.keys(
                    roadAccessObservationScenarios,
                ),
            };
        }

        return this.runner.run(
            scenario as keyof typeof roadAccessObservationScenarios,
        );
    }
}