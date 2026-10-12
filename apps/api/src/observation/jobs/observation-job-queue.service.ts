import { Injectable } from '@nestjs/common';

import type { InterpretObservationJob } from './interpret-observation.job.js';
import type { ObservationJobQueue } from './observation-job-queue.interface.js';

@Injectable()
export class ObservationJobQueueService implements ObservationJobQueue {
    async addInterpretObservationJob(
        job: InterpretObservationJob,
    ): Promise<void> {
        // Queue implementation will be added later.
        void job;
    }
}