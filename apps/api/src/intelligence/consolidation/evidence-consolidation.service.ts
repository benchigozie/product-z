import { Inject, Injectable } from '@nestjs/common';

import type { ObservationListResult } from '../../observation/types/observation-result.type.js';
import type { ConsolidatedEvidence } from './types/consolidated-evidence.type.js';
import type { EvidenceConsolidationStrategy } from './types/evidence-consolidation-strategy.type.js';

export const EVIDENCE_CONSOLIDATION_STRATEGIES = Symbol(
    'EVIDENCE_CONSOLIDATION_STRATEGIES',
);

@Injectable()
export class EvidenceConsolidationService {
    constructor(
        @Inject(EVIDENCE_CONSOLIDATION_STRATEGIES)
        private readonly strategies: EvidenceConsolidationStrategy[],
    ) {}

    consolidate(
        observations: ObservationListResult,
    ): ConsolidatedEvidence[] {
        const results: ConsolidatedEvidence[] = [];

        for (const strategy of this.strategies) {
            const relevantObservations = observations.filter(
                (observation) =>
                    observation.category === strategy.category,
            );

            results.push(
                ...strategy.consolidate(relevantObservations),
            );
        }

        return results;
    }
}