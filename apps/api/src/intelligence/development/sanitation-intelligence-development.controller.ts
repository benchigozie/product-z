import { Controller, Param, Post } from '@nestjs/common';

import { SanitationIntelligenceRunner } from './sanitation-intelligence.runner.js';
import { sanitationObservationScenarios } from './fixtures/sanitation-observation.scenarios.js';
@Controller('development/intelligence/sanitation')
export class SanitationIntelligenceDevelopmentController {
    constructor(private readonly runner: SanitationIntelligenceRunner) {}

    @Post(':scenario')
    async runScenario(@Param('scenario') scenario: string) {
        if (
            !Object.prototype.hasOwnProperty.call(
                sanitationObservationScenarios,
                scenario,
            )
        ) {
            return {
                error: 'Invalid sanitation observation scenario.',
                availableScenarios: Object.keys(
                    sanitationObservationScenarios,
                ),
            };
        }

        return this.runner.run(
            scenario as keyof typeof sanitationObservationScenarios,
        );
    }
}