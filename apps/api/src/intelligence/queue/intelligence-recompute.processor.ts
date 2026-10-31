import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';

import { IntelligenceRecomputeService } from './intelligence-recompute.service.js';
import {
    INTELLIGENCE_RECOMPUTE_JOB,
    INTELLIGENCE_RECOMPUTE_QUEUE,
} from './intelligence-recompute.constants.js';
import type { IntelligenceRecomputeJobData } from './intelligence-recompute.constants.js';

@Processor(INTELLIGENCE_RECOMPUTE_QUEUE, { concurrency: 2 })
export class IntelligenceRecomputeProcessor extends WorkerHost {
    private readonly logger = new Logger(IntelligenceRecomputeProcessor.name);

    constructor(
        private readonly recomputeService: IntelligenceRecomputeService,
    ) {
        super();
    }

    async process(job: Job<IntelligenceRecomputeJobData>): Promise<void> {
        if (job.name !== INTELLIGENCE_RECOMPUTE_JOB) {
            this.logger.warn(`Unknown job name: ${job.name}`);
            return;
        }

        try {
            await this.recomputeService.recompute(job.data);
        } catch (error) {
            this.logger.error(
                `Recompute job failed: ${error instanceof Error ? error.message : String(error)}`,
            );
            throw error;
        }
    }
}