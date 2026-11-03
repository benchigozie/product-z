import { Controller, Param, Post } from '@nestjs/common';

import { SecurityIntelligenceRunner } from './security-intelligence.runner.js';
import { securityObservationScenarios } from './fixtures/security-observation.scenarios.js';

@Controller('development/intelligence/security')
export class SecurityIntelligenceDevelopmentController {
    constructor(private readonly runner: SecurityIntelligenceRunner) {}

    @Post(':scenario')
    async runScenario(@Param('scenario') scenario: string) {
        if (
            !Object.prototype.hasOwnProperty.call(
                securityObservationScenarios,
                scenario,
            )
        ) {
            return {
                error: 'Invalid security observation scenario.',
                availableScenarios: Object.keys(securityObservationScenarios),
            };
        }

        return this.runner.run(
            scenario as keyof typeof securityObservationScenarios,
        );
    }
}