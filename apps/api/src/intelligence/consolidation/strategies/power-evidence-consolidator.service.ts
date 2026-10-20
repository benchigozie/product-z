import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import {
    PowerSource,
    type PowerData,
} from '../../../observation/types/power/power-data.type.js';
import { Availability } from '../../../observation/types/common/availability.type.js';
import { Reliability } from '../../../observation/types/common/reliability.type.js';

import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { EvidenceConsolidationStrategy } from '../types/evidence-consolidation-strategy.type.js';
import type { PowerClaimData } from '../types/power-claim-data.type.js';

function isPowerData(value: unknown): value is PowerData {
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
            Object.values(PowerSource).includes(source as PowerSource),
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
export class PowerEvidenceConsolidator implements EvidenceConsolidationStrategy {
    readonly category = ObservationCategory.POWER;

    consolidate(
        observations: ObservationListResult,
    ): ConsolidatedEvidence<PowerClaimData>[] {
        const groups = new Map<
            string,
            ConsolidatedEvidence<PowerClaimData>
        >();

        for (const observation of observations) {
            if (observation.category !== this.category) {
                continue;
            }

            if (!isPowerData(observation.data)) {
                continue;
            }

            const source = [...new Set(observation.data.source)].sort();
            const availability = observation.data.availability;

            const claimData: PowerClaimData = {
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
                id: `power:${key}`,
                category: this.category,
                claimType: 'POWER_SOURCE_AVAILABILITY',
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