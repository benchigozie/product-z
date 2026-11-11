import { Module, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import Redis from 'ioredis';

import { IntelligenceModule } from '../intelligence.module.js';
import { IntelligenceLockService, INTELLIGENCE_REDIS } from './intelligence-lock.service.js';
import { IntelligenceRecomputeService } from './intelligence-recompute.service.js';
import { IntelligenceRecomputeProcessor } from './intelligence-recompute.processor.js';
import { IntelligenceRecomputeScheduler } from './intelligence-recompute.scheduler.js';
import { INTELLIGENCE_RECOMPUTE_QUEUE } from './intelligence-recompute.constants.js';

import { IntelligenceSummaryProcessor } from './intelligence-summary.processor.js';
import { IntelligenceSummaryDebugController } from './intelligence-summary-debug.controller.js';
import { INTELLIGENCE_SUMMARY_QUEUE } from './intelligence-summary.queue.constants.js';

import { SessionModule } from '../../session/session.module.js';

@Module({
    imports: [
        forwardRef(() => IntelligenceModule),
        BullModule.registerQueue({
            name: INTELLIGENCE_RECOMPUTE_QUEUE,
        }),
        BullModule.registerQueue({
            name: INTELLIGENCE_SUMMARY_QUEUE,
        }),
        SessionModule,
    ],
    providers: [
        {
            provide: INTELLIGENCE_REDIS,
            inject: [ConfigService],
            useFactory: (config: ConfigService): Redis => {
                const url = config.get<string>('REDIS_URL');
                if (!url) {
                    throw new Error(
                        'REDIS_URL is required for the intelligence lock service.',
                    );
                }
                return new Redis(url);
            },
        },
        IntelligenceLockService,
        IntelligenceRecomputeService,
        IntelligenceRecomputeProcessor,
        IntelligenceRecomputeScheduler,
        IntelligenceSummaryProcessor,
    ],
    controllers: [IntelligenceSummaryDebugController],
    exports: [
        IntelligenceRecomputeService,
        BullModule,
    ],
})
export class IntelligenceQueueModule {}