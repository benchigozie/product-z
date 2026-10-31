import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';

import { InterpretObservationWorker } from './interpret-observation.worker.js';
import { INTERPRET_OBSERVATION_JOB, OBSERVATION_QUEUE } from './observation-job-queue.service.js';
import type { InterpretObservationJob } from './interpret-observation.job.js';

@Processor(OBSERVATION_QUEUE, { concurrency: 2 })
export class ObservationProcessor extends WorkerHost {
    private readonly logger = new Logger(ObservationProcessor.name);

    constructor(
        private readonly interpretWorker: InterpretObservationWorker,
    ) {
        super();
    }

    async process(job: Job<InterpretObservationJob>): Promise<void> {
        if (job.name !== INTERPRET_OBSERVATION_JOB) {
            this.logger.warn(`Unknown observation job: ${job.name}`);
            return;
        }

        try {
            await this.interpretWorker.process(job.data);
        } catch (error) {
            this.logger.error(
                `Observation job failed: ${error instanceof Error ? error.message : String(error)}`,
            );
            throw error;
        }
    }
}