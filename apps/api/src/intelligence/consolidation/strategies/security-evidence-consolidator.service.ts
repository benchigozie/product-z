import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { SecurityAccessControl } from '../../../observation/types/security/security-access-control.type.js';
import { SecurityPersonnel } from '../../../observation/types/security/security-personnel.type.js';
import { SecurityFeature } from '../../../observation/types/security/security-feature.type.js';
import type { SecurityData } from '../../../observation/types/security/security-data.type.js';

import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { EvidenceConsolidationStrategy } from '../types/evidence-consolidation-strategy.type.js';
import type { SecurityClaimData } from '../types/security-claim-data.type.js';

function isSecurityData(value: unknown): value is SecurityData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return (
        (data.accessControl === undefined ||
            Object.values(SecurityAccessControl).includes(
                data.accessControl as SecurityAccessControl,
            )) &&
        (data.personnel === undefined ||
            Object.values(SecurityPersonnel).includes(
                data.personnel as SecurityPersonnel,
            )) &&
        (data.features === undefined ||
            (Array.isArray(data.features) &&
                data.features.every((f) =>
                    Object.values(SecurityFeature).includes(
                        f as SecurityFeature,
                    ),
                )))
    );
}

@Injectable()
export class SecurityEvidenceConsolidator implements EvidenceConsolidationStrategy {
    readonly category = ObservationCategory.SECURITY;

    consolidate(
        observations: ObservationListResult,
    ): ConsolidatedEvidence<SecurityClaimData>[] {
        const groups = new Map<
            string,
            ConsolidatedEvidence<SecurityClaimData>
        >();

        for (const observation of observations) {
            if (observation.category !== this.category) {
                continue;
            }

            if (!isSecurityData(observation.data)) {
                continue;
            }

            const claimData: SecurityClaimData = {
                accessControl: observation.data.accessControl,
                personnel: observation.data.personnel,
            };

            const key = JSON.stringify({
                accessControl: claimData.accessControl ?? null,
                personnel: claimData.personnel ?? null,
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
                id: `security:${key}`,
                category: this.category,
                claimType: 'SECURITY_ACCESS_CONTROL_PERSONNEL',
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