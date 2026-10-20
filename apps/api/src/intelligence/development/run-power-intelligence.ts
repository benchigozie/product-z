
import { NestFactory } from '@nestjs/core';

import { IntelligenceDevelopmentModule } from './intelligence-development.module.js';
import { PowerIntelligenceRunner } from './power-intelligence.runner.js';

import { powerObservationScenarios } from './fixtures/power-observation.scenarios.js';

import 'reflect-metadata';

import { EvidenceAnalysisService } from '../evidence/evidence-analysis.service.js';


async function main(): Promise<void> {
    const scenarioName = process.argv[2];

    if (
        !scenarioName ||
        !Object.prototype.hasOwnProperty.call(
            powerObservationScenarios,
            scenarioName,
        )
    ) {
        console.error('Choose a valid power observation scenario.');
        console.error(
            'Available scenarios:',
            Object.keys(powerObservationScenarios).join(', '),
        );
        process.exitCode = 1;
        return;
    }

    const app = await NestFactory.createApplicationContext(
        IntelligenceDevelopmentModule,
        {
            logger: ['error', 'warn', 'log'],
        },
    );

    try {
        const runner = app.get(PowerIntelligenceRunner);

        const result = await runner.run(
            scenarioName as keyof typeof powerObservationScenarios,
        );

      
    } finally {
        await app.close();
    }
}

main().catch((error: unknown) => {
    console.error('Power intelligence run failed:', error);
    process.exitCode = 1;
});
