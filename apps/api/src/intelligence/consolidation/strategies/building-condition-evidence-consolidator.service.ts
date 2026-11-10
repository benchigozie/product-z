import { Injectable } from '@nestjs/common';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { BuildingCondition } from '../../../observation/types/building-condition/building-condition.type.js';
import { BuildingComponent } from '../../../observation/types/building-condition/building-component.type.js';
import { BuildingIssue } from '../../../observation/types/building-condition/building-issue.type.js';
import type { BuildingConditionData } from '../../../observation/types/building-condition/building-condition-data.type.js';

import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { EvidenceConsolidationStrategy } from '../types/evidence-consolidation-strategy.type.js';
import type { BuildingConditionClaimData } from '../types/building-condition-claim-data.type.js';

function isBuildingConditionData(
    value: unknown,
): value is BuildingConditionData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return (
        Object.values(BuildingCondition).includes(
            data.condition as BuildingCondition,
        ) &&
        Array.isArray(data.issues) &&
        data.issues.every((entry) => {
            if (
                typeof entry !== 'object' ||
                entry === null ||
                Array.isArray(entry)
            ) {
                return false;
            }
            const e = entry as Record<string, unknown>;
            return (
                Object.values(BuildingIssue).includes(
                    e.issue as BuildingIssue,
                ) &&
                (e.component === undefined ||
                    Object.values(BuildingComponent).includes(
                        e.component as BuildingComponent,
                    ))
            );
        }) &&
        Array.isArray(data.components) &&
        data.components.every((c) =>
            Object.values(BuildingComponent).includes(
                c as BuildingComponent,
            ),
        )
    );
}

@Injectable()
export class BuildingConditionEvidenceConsolidator implements EvidenceConsolidationStrategy {
    readonly category = ObservationCategory.BUILDING_CONDITION;

    consolidate(
        observations: ObservationListResult,
    ): ConsolidatedEvidence<BuildingConditionClaimData>[] {
        const groups = new Map<
            string,
            ConsolidatedEvidence<BuildingConditionClaimData>
        >();

        for (const observation of observations) {
            if (observation.category !== this.category) {
                continue;
            }

            if (!isBuildingConditionData(observation.data)) {
                continue;
            }

            const sortedIssues = [...observation.data.issues]
                .map((entry) => ({
                    issue: entry.issue,
                    component: entry.component,
                }))
                .sort((a, b) => {
                    const keyA = `${a.issue}:${a.component ?? ''}`;
                    const keyB = `${b.issue}:${b.component ?? ''}`;
                    return keyA.localeCompare(keyB);
                });

            const claimData: BuildingConditionClaimData = {
                condition: observation.data.condition,
                issues: sortedIssues,
            };

            const key = JSON.stringify({
                condition: claimData.condition,
                issues: claimData.issues.map((i) => ({
                    issue: i.issue,
                    component: i.component ?? null,
                })),
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
                id: `building-condition:${key}`,
                category: this.category,
                claimType: 'BUILDING_CONDITION_ISSUES',
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