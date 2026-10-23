import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { FloodingOccurrence } from '../../../observation/types/flooding/flooding-occurrence.type.js';
import { FloodingExtent } from '../../../observation/types/flooding/flooding-extent.type.js';
import { Severity } from '../../../observation/types/common/severity.type.js';
import type { FloodingData } from '../../../observation/types/flooding/flooding-data.type.js';

import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { EvidenceConsolidationStrategy } from '../types/evidence-consolidation-strategy.type.js';
import type { FloodingClaimData } from '../types/flooding-claim-data.type.js';

function isFloodingData(value: unknown): value is FloodingData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return (
        Object.values(FloodingOccurrence).includes(
            data.occurrence as FloodingOccurrence,
        ) &&
        Object.values(FloodingExtent).includes(
            data.extent as FloodingExtent,
        ) &&
        (
            data.severity === undefined ||
            Object.values(Severity).includes(
                data.severity as Severity,
            )
        )
    );
}

@Injectable()
export class FloodingEvidenceConsolidator implements EvidenceConsolidationStrategy {
    readonly category = ObservationCategory.FLOODING;

    consolidate(
        observations: ObservationListResult,
    ): ConsolidatedEvidence<FloodingClaimData>[] {
        const groups = new Map<
            string,
            ConsolidatedEvidence<FloodingClaimData>
        >();

        for (const observation of observations) {
            if (observation.category !== this.category) {
                continue;
            }

            if (!isFloodingData(observation.data)) {
                continue;
            }

            const occurrence = observation.data.occurrence;

            const claimData: FloodingClaimData = {
                occurrence,
            };

            const key = JSON.stringify({
                occurrence,
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
                id: `flooding:${key}`,
                category: this.category,
                claimType: 'FLOODING_OCCURRENCE',
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