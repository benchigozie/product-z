import type { InterpretObservationJob } from './interpret-observation.job.js';

export const OBSERVATION_JOB_QUEUE = Symbol('OBSERVATION_JOB_QUEUE');

export interface ObservationJobQueue {
    addInterpretObservationJob(
        job: InterpretObservationJob,
    ): Promise<void>;
}