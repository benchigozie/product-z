import type { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import type { ConsolidatedEvidence } from './consolidated-evidence.type.js';

export interface EvidenceConsolidationStrategy {
    readonly category: ObservationCategory;

    consolidate(
        observations: ObservationListResult,
    ): ConsolidatedEvidence[];
}