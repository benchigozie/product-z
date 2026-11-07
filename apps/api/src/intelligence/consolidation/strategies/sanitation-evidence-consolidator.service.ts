import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { SanitationCondition } from '../../../observation/types/sanitation/sanitation-condition.type.js';
import type { SanitationData } from '../../../observation/types/sanitation/sanitation-data.type.js';

import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { EvidenceConsolidationStrategy } from '../types/evidence-consolidation-strategy.type.js';
import type { SanitationClaimData } from '../types/sanitation-claim-data.type.js';

function isSanitationData(value: unknown): value is SanitationData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return Object.values(SanitationCondition).includes(
        data.condition as SanitationCondition,
    );
}

@Injectable()
export class SanitationEvidenceConsolidator implements EvidenceConsolidationStrategy {
    readonly category = ObservationCategory.SANITATION;

    consolidate(
        observations: ObservationListResult,
    ): ConsolidatedEvidence<SanitationClaimData>[] {
        const groups = new Map<
            string,
            ConsolidatedEvidence<SanitationClaimData>
        >();

        for (const observation of observations) {
            if (observation.category !== this.category) {
                continue;
            }

            if (!isSanitationData(observation.data)) {
                continue;
            }

            const claimData: SanitationClaimData = {
                condition: observation.data.condition,
            };

            const key = JSON.stringify({
                condition: claimData.condition,
            });

            const observedAt = new Date(observation.observedAt);

            if (Number.isNaN(observedAt.getTime())) {
                continue;
            }

            const existing = groups.get(key);

            if (existing) {
                existing.observationIds.push(observation.id);
                existing.observationCount += 1;

                if (observedAt < existing.firstObservedAt) {
                    existing.firstObservedAt = observedAt;
                }

                if (observedAt > existing.lastObservedAt) {
                    existing.lastObservedAt = observedAt;
                }

                continue;
            }

            groups.set(key, {
                id: `sanitation:${key}`,
                category: this.category,
                claimType: 'SANITATION_CONDITION',
                claimData,
                observationIds: [observation.id],
                firstObservedAt: observedAt,
                lastObservedAt: observedAt,
                observationCount: 1,
            });
        }

        return [...groups.values()];
    }
}