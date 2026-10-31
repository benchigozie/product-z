import { Controller, Post, Body } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';

import {
    INTELLIGENCE_RECOMPUTE_JOB,
    INTELLIGENCE_RECOMPUTE_QUEUE,
    RECOMPUTE_DEBOUNCE_MS,
    RECOMPUTE_JOB_OPTIONS,
} from './intelligence-recompute.constants.js';

@Controller('development/intelligence/queue')
export class IntelligenceQueueDebugController {
    constructor(
        @InjectQueue(INTELLIGENCE_RECOMPUTE_QUEUE)
        private readonly queue: Queue,
    ) {}

    @Post('enqueue')
    async enqueue(
        @Body()
        body: {
            propertyId: string;
            category: 'POWER' | 'WATER' | 'FLOODING';
        },
    ) {
        const job = await this.queue.add(
            INTELLIGENCE_RECOMPUTE_JOB,
            {
                propertyId: body.propertyId,
                category: body.category,
                reason: 'MANUAL',
            },
            {
                ...RECOMPUTE_JOB_OPTIONS,
                delay: RECOMPUTE_DEBOUNCE_MS,
            },
        );

        return {
            enqueued: true,
            jobId: job.id,
            queueCounts: await this.queue.getJobCounts(),
        };
    }
}