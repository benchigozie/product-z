import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { Availability } from '../../../observation/types/common/availability.type.js';
import { Reliability } from '../../../observation/types/common/reliability.type.js';
import { Coverage } from '../../../observation/types/internet/coverage.type.js';
import { InternetConnectionType } from '../../../observation/types/internet/internet-connection-type.type.js';
import type { InternetData } from '../../../observation/types/internet/internet-data.type.js';

import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { EvidenceConsolidationStrategy } from '../types/evidence-consolidation-strategy.type.js';
import type { InternetClaimData } from '../types/internet-claim-data.type.js';

function isInternetData(value: unknown): value is InternetData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return (
        typeof data.provider === 'string' &&
        Object.values(InternetConnectionType).includes(
            data.connectionType as InternetConnectionType,
        ) &&
        Object.values(Availability).includes(
            data.availability as Availability,
        ) &&
        (data.reliability === undefined ||
            Object.values(Reliability).includes(
                data.reliability as Reliability,
            )) &&
        (data.coverage === undefined ||
            Object.values(Coverage).includes(data.coverage as Coverage))
    );
}

@Injectable()
export class InternetEvidenceConsolidator implements EvidenceConsolidationStrategy {
    readonly category = ObservationCategory.INTERNET;

    consolidate(
        observations: ObservationListResult,
    ): ConsolidatedEvidence<InternetClaimData>[] {
        const groups = new Map<
            string,
            ConsolidatedEvidence<InternetClaimData>
        >();

        for (const observation of observations) {
            if (observation.category !== this.category) {
                continue;
            }

            if (!isInternetData(observation.data)) {
                continue;
            }

            const claimData: InternetClaimData = {
                connectionType: observation.data.connectionType,
                availability: observation.data.availability,
            };

            const key = JSON.stringify({
                connectionType: claimData.connectionType,
                availability: claimData.availability,
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
                id: `internet:${key}`,
                category: this.category,
                claimType: 'INTERNET_CONNECTION_AVAILABILITY',
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