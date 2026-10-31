import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import type { Queue } from 'bullmq';

import type { InterpretObservationJob } from './interpret-observation.job.js';
import type { ObservationJobQueue } from './observation-job-queue.interface.js';

export const OBSERVATION_QUEUE = 'observation-jobs';
export const INTERPRET_OBSERVATION_JOB = 'interpret-observation';

@Injectable()
export class ObservationJobQueueService implements ObservationJobQueue {
    constructor(
        @InjectQueue(OBSERVATION_QUEUE)
        private readonly queue: Queue,
    ) {}

    async addInterpretObservationJob(
        job: InterpretObservationJob,
    ): Promise<void> {
        await this.queue.add(
            INTERPRET_OBSERVATION_JOB,
            job,
            {
                attempts: 3,
                backoff: { type: 'exponential', delay: 30_000 },
                removeOnComplete: true,
                removeOnFail: false,
            },
        );
    }
}