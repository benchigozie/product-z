import type { ObservationResult } from '../../../observation/types/observation-result.type.js';
import type { EvidenceRecencyClassification } from '../evidence-recency.classification.js';

type ObservedCategory = NonNullable<ObservationResult>['category'];

export interface ObservationRecencyAnalysis {
    observationId: string;
    category: ObservedCategory;
    classification: EvidenceRecencyClassification;
}