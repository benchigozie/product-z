import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { ObservationController } from './observation.controller.js';
import { ObservationService } from './observation.service.js';
import { SessionModule } from '../session/session.module.js';

import { ObservationJobQueueService, OBSERVATION_QUEUE } from './jobs/observation-job-queue.service.js';
import { OBSERVATION_JOB_QUEUE } from './jobs/observation-job-queue.interface.js';
import { InterpretObservationWorker } from './jobs/interpret-observation.worker.js';
import { ObservationProcessor } from './jobs/observation.processor.js';
import { IntelligenceModule } from '../intelligence/intelligence.module.js';
import { IntelligenceQueueModule } from '../intelligence/queue/intelligence-queue.module.js';
import { ObservationDataModule } from './data/observation-data.module.js';

@Module({
    imports: [
        SessionModule,
        IntelligenceModule,
        IntelligenceQueueModule,
        ObservationDataModule,
        BullModule.registerQueue({
            name: OBSERVATION_QUEUE,
        }),
    ],

    controllers: [
        ObservationController,
    ],

    providers: [
        InterpretObservationWorker,
        ObservationProcessor,
        ObservationService,
        ObservationJobQueueService,
        {
            provide: OBSERVATION_JOB_QUEUE,
            useExisting: ObservationJobQueueService,
        },
    ],
})
export class ObservationModule {}