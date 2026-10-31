export const INTELLIGENCE_RECOMPUTE_QUEUE = 'intelligence-recompute';

export const INTELLIGENCE_RECOMPUTE_JOB = 'recompute';

export type IntelligenceRecomputeReason =
    | 'NEW_OBSERVATION'
    | 'PROMPT_CHANGE'
    | 'MANUAL'
    | 'RETRY';

export interface IntelligenceRecomputeJobData {
    propertyId?: string;
    placeId?: string;
    category: string;
    reason: IntelligenceRecomputeReason;
}

export const RECOMPUTE_JOB_OPTIONS = {
    attempts: 3,
    backoff: {
        type: 'exponential' as const,
        delay: 60_000,
    },
    removeOnComplete: true,
    removeOnFail: false,
};

export const RECOMPUTE_DEBOUNCE_MS = 2_000;

export const INTELLIGENCE_LOCK_TTL_SECONDS = 10;

export const INTELLIGENCE_FAILED_RETRY_CRON = '0 0 */3 * * *';