import { Controller, Param, Post } from '@nestjs/common';

import { BuildingConditionIntelligenceRunner } from './building-condition-intelligence.runner.js';
import { buildingConditionObservationScenarios } from './fixtures/building-condition-observation.scenarios.js';

@Controller('development/intelligence/building-condition')
export class BuildingConditionIntelligenceDevelopmentController {
    constructor(
        private readonly runner: BuildingConditionIntelligenceRunner,
    ) {}

    @Post(':scenario')
    async runScenario(@Param('scenario') scenario: string) {
        if (
            !Object.prototype.hasOwnProperty.call(
                buildingConditionObservationScenarios,
                scenario,
            )
        ) {
            return {
                error: 'Invalid building condition observation scenario.',
                availableScenarios: Object.keys(
                    buildingConditionObservationScenarios,
                ),
            };
        }

        return this.runner.run(
            scenario as keyof typeof buildingConditionObservationScenarios,
        );
    }
}