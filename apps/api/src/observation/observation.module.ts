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

import { ObservationTextController } from './observation-text.controller.js';
import { ObservationIngestionService } from '../intelligence/ingestion/observation-ingestion.service.js';
import { ObservationIngestionPrompt } from '../intelligence/ingestion/prompts/observation-ingestion.prompt.js';
import { ObservationIngestionValidationService } from '../intelligence/ingestion/observation-ingestion.validation.js';

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
        ObservationTextController,
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
        ObservationIngestionService,
        ObservationIngestionPrompt,
        ObservationIngestionValidationService,
    ],
})
export class ObservationModule { }