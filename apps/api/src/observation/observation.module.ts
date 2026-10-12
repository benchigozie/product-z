import { Module } from '@nestjs/common';

import { ObservationController } from './observation.controller.js';
import { ObservationService } from './observation.service.js';
import { SessionModule } from '../session/session.module.js';

import { ObservationJobQueueService } from './jobs/observation-job-queue.service.js';
import { OBSERVATION_JOB_QUEUE } from './jobs/observation-job-queue.interface.js';
import { InterpretObservationWorker } from './jobs/interpret-observation.worker.js';
import { IntelligenceModule } from '../intelligence/intelligence.module.js';
import { ObservationDataModule } from './data/observation-data.module.js';

@Module({
    imports: [
        SessionModule,
        IntelligenceModule,
        ObservationDataModule,
    ],

    controllers: [
        ObservationController,
    ],

    providers: [
        InterpretObservationWorker,
        ObservationService,
        ObservationJobQueueService,
        {
            provide: OBSERVATION_JOB_QUEUE,
            useExisting: ObservationJobQueueService,
        },
    ],
})
export class ObservationModule {}