import type { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';

export interface ConsolidatedEvidence<TClaimData = unknown> {
    id: string;
    category: ObservationCategory;
    claimType: string;
    claimData: TClaimData;
    observationIds: string[];
    firstObservedAt: Date;
    lastObservedAt: Date;
    observationCount: number;
}