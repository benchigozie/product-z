export const INTELLIGENCE_SUMMARY_QUEUE = 'intelligence-summary';

export const INTELLIGENCE_SUMMARY_JOB = 'generate-summary';

export interface IntelligenceSummaryJobData {
    propertyId?: string;
    placeId?: string;
}

export const SUMMARY_JOB_OPTIONS = {
    attempts: 2,
    backoff: {
        type: 'exponential' as const,
        delay: 30_000,
    },
    removeOnComplete: true,
    removeOnFail: false,
};

export const SUMMARY_DEBOUNCE_MS = 10_000;