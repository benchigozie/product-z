import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';

import { PrismaService } from '../../prisma.service.js';
import {
    INTELLIGENCE_RECOMPUTE_JOB,
    INTELLIGENCE_RECOMPUTE_QUEUE,
    RECOMPUTE_DEBOUNCE_MS,
    RECOMPUTE_JOB_OPTIONS,
} from './intelligence-recompute.constants.js';

@Injectable()
export class IntelligenceAdminService {
    private readonly logger = new Logger(IntelligenceAdminService.name);

    constructor(
        private readonly prisma: PrismaService,
        @InjectQueue(INTELLIGENCE_RECOMPUTE_QUEUE)
        private readonly queue: Queue,
    ) {}

    async getStatus() {
        const counts = await this.queue.getJobCounts();
        const rows = await this.prisma.db.orm.public.Intelligence.all();

        return {
            queue: counts,
            intelligenceRows: {
                total: rows.length,
                byStatus: rows.reduce<Record<string, number>>((acc, row) => {
                    acc[row.status] = (acc[row.status] ?? 0) + 1;
                    return acc;
                }, {}),
            },
        };
    }

    async recomputeOne(propertyId: string, category: string) {
        const job = await this.queue.add(
            INTELLIGENCE_RECOMPUTE_JOB,
            {
                propertyId,
                category,
                reason: 'MANUAL',
            },
            {
                ...RECOMPUTE_JOB_OPTIONS,
                delay: RECOMPUTE_DEBOUNCE_MS,
            },
        );

        return { enqueued: true, jobId: job.id };
    }

    async recomputeByPromptVersion(
        category: string,
        fromVersion: string,
    ) {
        const allRows = await this.prisma.db.orm.public.Intelligence.all();
        const categoryKey = category.toLowerCase();

        const matching = allRows.filter((row) => {
            const cats = (row.categories as Record<string, any> | null) ?? {};
            const catData = cats[categoryKey];
            if (!catData) return false;
            return catData.promptVersion === fromVersion;
        });

        let enqueued = 0;
        for (const row of matching) {
            if (!row.propertyId) continue;

            await this.queue.add(
                INTELLIGENCE_RECOMPUTE_JOB,
                {
                    propertyId: row.propertyId,
                    category,
                    reason: 'PROMPT_CHANGE',
                },
                {
                    ...RECOMPUTE_JOB_OPTIONS,
                    delay: RECOMPUTE_DEBOUNCE_MS,
                    jobId: `prompt-change:${category}:${row.propertyId}`,
                },
            );

            enqueued++;
        }

        this.logger.log(
            `Enqueued ${enqueued} recompute jobs for ${category} prompt version ${fromVersion}.`,
        );

        return {
            category,
            fromVersion,
            matched: matching.length,
            enqueued,
        };
    }
}