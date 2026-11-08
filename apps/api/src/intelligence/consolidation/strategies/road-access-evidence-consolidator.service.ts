import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { RoadAccessibility } from '../../../observation/types/road/road-accessibility.type.js';
import { RoadCondition } from '../../../observation/types/road/road-condition.type.js';
import type { RoadAccessData } from '../../../observation/types/road/road-access-data.type.js';

import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { EvidenceConsolidationStrategy } from '../types/evidence-consolidation-strategy.type.js';
import type { RoadAccessClaimData } from '../types/road-access-claim-data.type.js';

function isRoadAccessData(value: unknown): value is RoadAccessData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return (
        Object.values(RoadCondition).includes(
            data.condition as RoadCondition,
        ) &&
        Array.isArray(data.accessibility) &&
        data.accessibility.length > 0 &&
        data.accessibility.every((v) =>
            Object.values(RoadAccessibility).includes(
                v as RoadAccessibility,
            ),
        )
    );
}

function maxAccessibility(
    values: RoadAccessibility[],
): RoadAccessibility {
    const order: Record<RoadAccessibility, number> = {
        [RoadAccessibility.WALKING]: 0,
        [RoadAccessibility.MOTORCYCLE]: 1,
        [RoadAccessibility.CAR]: 2,
        [RoadAccessibility.LARGE_VEHICLE]: 3,
    };

    let max = values[0]!;
    for (const value of values) {
        if (order[value] > order[max]) max = value;
    }
    return max;
}

@Injectable()
export class RoadAccessEvidenceConsolidator implements EvidenceConsolidationStrategy {
    readonly category = ObservationCategory.ROAD_ACCESS;

    consolidate(
        observations: ObservationListResult,
    ): ConsolidatedEvidence<RoadAccessClaimData>[] {
        const groups = new Map<
            string,
            ConsolidatedEvidence<RoadAccessClaimData>
        >();

        for (const observation of observations) {
            if (observation.category !== this.category) {
                continue;
            }

            if (!isRoadAccessData(observation.data)) {
                continue;
            }

            const claimData: RoadAccessClaimData = {
                condition: observation.data.condition,
                maxAccessibility: maxAccessibility(
                    observation.data.accessibility,
                ),
            };

            const key = JSON.stringify({
                condition: claimData.condition,
                maxAccessibility: claimData.maxAccessibility,
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
                id: `road-access:${key}`,
                category: this.category,
                claimType: 'ROAD_CONDITION_ACCESSIBILITY',
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