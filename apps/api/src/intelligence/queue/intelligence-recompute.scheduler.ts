import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';
import { PrismaService } from '../../prisma.service.js';

import {
    INTELLIGENCE_FAILED_RETRY_CRON,
    INTELLIGENCE_RECOMPUTE_JOB,
    INTELLIGENCE_RECOMPUTE_QUEUE,
    RECOMPUTE_JOB_OPTIONS,
} from './intelligence-recompute.constants.js';

@Injectable()
export class IntelligenceRecomputeScheduler {
    private readonly logger = new Logger(IntelligenceRecomputeScheduler.name);

    constructor(
        @InjectQueue(INTELLIGENCE_RECOMPUTE_QUEUE)
        private readonly queue: Queue,
        private readonly prisma: PrismaService,
    ) {}

    @Cron(INTELLIGENCE_FAILED_RETRY_CRON)
    async retryFailed(): Promise<void> {
        const failed = await this.prisma.db.orm.public.Intelligence
            .where({ status: 'FAILED' })
            .all();

        if (failed.length === 0) {
            return;
        }

        this.logger.log(`Retrying ${failed.length} failed intelligence rows.`);

        for (const row of failed) {
            const categories = Object.keys(
                (row.categories as Record<string, unknown> | null) ?? {},
            );

            const targetCategories =
                categories.length > 0 ? categories : ['power'];

            for (const category of targetCategories) {
                await this.queue.add(
                    INTELLIGENCE_RECOMPUTE_JOB,
                    {
                        propertyId: row.propertyId ?? undefined,
                        placeId: row.placeId ?? undefined,
                        category: category.toUpperCase(),
                        reason: 'RETRY',
                    },
                    {
                        ...RECOMPUTE_JOB_OPTIONS,
                        jobId: `retry:${row.propertyId ?? row.placeId}:${category}:${Date.now()}`,
                    },
                );
            }
        }
    }
}