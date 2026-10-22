import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { WaterSource } from '../../../observation/types/water/water-source.type.js';
import type { WaterData } from '../../../observation/types/water/water-data.type.js';
import { Availability } from '../../../observation/types/common/availability.type.js';
import { Reliability } from '../../../observation/types/common/reliability.type.js';

import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { EvidenceConsolidationStrategy } from '../types/evidence-consolidation-strategy.type.js';
import type { WaterClaimData } from '../types/water-claim-data.type.js';

function isWaterData(value: unknown): value is WaterData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return (
        Array.isArray(data.source) &&
        data.source.length > 0 &&
        data.source.every((source) =>
            Object.values(WaterSource).includes(source as WaterSource),
        ) &&
        Object.values(Availability).includes(
            data.availability as Availability,
        ) &&
        (
            data.reliability === undefined ||
            Object.values(Reliability).includes(
                data.reliability as Reliability,
            )
        )
    );
}

@Injectable()
export class WaterEvidenceConsolidator implements EvidenceConsolidationStrategy {
    readonly category = ObservationCategory.WATER;

    consolidate(
        observations: ObservationListResult,
    ): ConsolidatedEvidence<WaterClaimData>[] {
        const groups = new Map<
            string,
            ConsolidatedEvidence<WaterClaimData>
        >();

        for (const observation of observations) {
            if (observation.category !== this.category) {
                continue;
            }

            if (!isWaterData(observation.data)) {
                continue;
            }

            const source = [...new Set(observation.data.source)].sort();
            const availability = observation.data.availability;

            const claimData: WaterClaimData = {
                source,
                availability,
            };

            const key = JSON.stringify({
                source,
                availability,
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
                id: `water:${key}`,
                category: this.category,
                claimType: 'WATER_SOURCE_AVAILABILITY',
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