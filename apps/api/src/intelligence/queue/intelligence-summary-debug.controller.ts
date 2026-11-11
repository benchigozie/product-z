import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';

import { SessionAuthGuard } from '../../auth/guards/session-auth.guard.js';
import {
    INTELLIGENCE_SUMMARY_JOB,
    INTELLIGENCE_SUMMARY_QUEUE,
    SUMMARY_DEBOUNCE_MS,
    SUMMARY_JOB_OPTIONS,
} from './intelligence-summary.queue.constants.js';

@Controller('development/admin/intelligence/summary')
@UseGuards(SessionAuthGuard)
export class IntelligenceSummaryDebugController {
    constructor(
        @InjectQueue(INTELLIGENCE_SUMMARY_QUEUE)
        private readonly queue: Queue,
    ) {}

    @Post('property/:propertyId')
    async triggerForProperty(
        @Param('propertyId') propertyId: string,
    ) {
        const job = await this.queue.add(
            INTELLIGENCE_SUMMARY_JOB,
            { propertyId },
            {
                ...SUMMARY_JOB_OPTIONS,
                delay: 0,
                jobId: `summary-debug-prop-${propertyId}-${Date.now()}`,
            },
        );

        return { enqueued: true, jobId: job.id };
    }

    @Post('place/:placeId')
    async triggerForPlace(@Param('placeId') placeId: string) {
        const job = await this.queue.add(
            INTELLIGENCE_SUMMARY_JOB,
            { placeId },
            {
                ...SUMMARY_JOB_OPTIONS,
                delay: 0,
                jobId: `summary-debug-place-${placeId}-${Date.now()}`,
            },
        );

        return { enqueued: true, jobId: job.id };
    }
}