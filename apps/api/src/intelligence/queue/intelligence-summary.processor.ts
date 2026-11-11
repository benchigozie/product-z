import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';

import { PrismaService } from '../../prisma.service.js';
import { IntelligenceSummaryService } from '../summary/intelligence-summary.service.js';
import {
    INTELLIGENCE_SUMMARY_JOB,
    INTELLIGENCE_SUMMARY_QUEUE,
} from './intelligence-summary.queue.constants.js';
import type { IntelligenceSummaryJobData } from './intelligence-summary.queue.constants.js';

@Processor(INTELLIGENCE_SUMMARY_QUEUE, { concurrency: 1 })
export class IntelligenceSummaryProcessor extends WorkerHost {
    private readonly logger = new Logger(
        IntelligenceSummaryProcessor.name,
    );

    constructor(
        private readonly prisma: PrismaService,
        private readonly summaryService: IntelligenceSummaryService,
    ) {
        super();
    }

    async process(
        job: Job<IntelligenceSummaryJobData>,
    ): Promise<void> {
        if (job.name !== INTELLIGENCE_SUMMARY_JOB) {
            this.logger.warn(`Unknown summary job name: ${job.name}`);
            return;
        }

        const { propertyId, placeId } = job.data;

        if (!propertyId && !placeId) {
            this.logger.warn('Summary job has neither propertyId nor placeId.');
            return;
        }

        try {
            const summary = propertyId
                ? await this.summaryService.generateForProperty(propertyId)
                : await this.summaryService.generateForPlace(placeId!);

            if (!summary) {
                this.logger.warn(
                    `Summary generation returned null for ${
                        propertyId ? `property ${propertyId}` : `place ${placeId}`
                    }; skipping write.`,
                );
                return;
            }

            const now = new Date();

            if (propertyId) {
                await this.prisma.db.orm.public.Intelligence
                    .where({ propertyId })
                    .update({
                        overall: summary as any,
                    });
            } else {
                await this.prisma.db.orm.public.Intelligence
                    .where({ placeId })
                    .update({
                        overall: summary as any,
                    });
            }

            this.logger.log(
                `Generated summary for ${
                    propertyId ? `property ${propertyId}` : `place ${placeId}`
                } (${summary.variants.length} variants, ${now.toISOString()}).`,
            );
        } catch (error) {
            this.logger.error(
                `Summary job failed for ${
                    propertyId ? `property ${propertyId}` : `place ${placeId}`
                }: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
            throw error;
        }
    }
}