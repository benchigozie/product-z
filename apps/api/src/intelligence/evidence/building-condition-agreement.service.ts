import { Injectable } from '@nestjs/common';

import { BuildingCondition } from '../../observation/types/building-condition/building-condition.type.js';
import { BuildingComponent } from '../../observation/types/building-condition/building-component.type.js';
import type { BuildingConditionData } from '../../observation/types/building-condition/building-condition-data.type.js';
import type { BuildingConditionAgreementResult } from './types/building-condition-agreement.type.js';

@Injectable()
export class BuildingConditionAgreementService {
    compare(
        first: BuildingConditionData,
        second: BuildingConditionData,
    ): BuildingConditionAgreementResult {
        const conditionDifference = Math.abs(
            this.conditionValue(first.condition) -
                this.conditionValue(second.condition),
        );

        // Overlap on the paired (issue, component) entries. Two entries are
        // "the same" only if both issue and component match. Entries with an
        // undefined component are keyed by issue alone.
        const firstIssueKeys = new Set(
            first.issues.map((e) => this.issueEntryKey(e)),
        );
        const secondIssueKeys = new Set(
            second.issues.map((e) => this.issueEntryKey(e)),
        );

        const issuesOverlap = this.jaccardFromSets(
            firstIssueKeys,
            secondIssueKeys,
        );

        const componentsOverlap = this.jaccardSimilarity(
            first.components,
            second.components,
        );

        return {
            conditionDifference,
            issuesOverlap,
            componentsOverlap,
        };
    }

    private issueEntryKey(entry: {
        issue: string;
        component?: string;
    }): string {
        return `${entry.issue}:${entry.component ?? ''}`;
    }

    private jaccardFromSets(
        a: Set<string>,
        b: Set<string>,
    ): number | null {
        if (a.size === 0 && b.size === 0) return null;

        let shared = 0;
        for (const v of a) {
            if (b.has(v)) shared++;
        }
        const union = new Set([...a, ...b]).size;
        return union === 0 ? null : shared / union;
    }

    private jaccardSimilarity<T>(a: T[], b: T[]): number | null {
        if (a.length === 0 && b.length === 0) return null;

        const aSet = new Set(a);
        const bSet = new Set(b);
        let shared = 0;
        for (const v of aSet) {
            if (bSet.has(v)) shared++;
        }
        const union = new Set([...aSet, ...bSet]).size;
        return union === 0 ? null : shared / union;
    }

    private conditionValue(value: BuildingCondition): number {
        switch (value) {
            case BuildingCondition.VERY_POOR:
                return 0;
            case BuildingCondition.POOR:
                return 1;
            case BuildingCondition.FAIR:
                return 2;
            case BuildingCondition.GOOD:
                return 3;
            case BuildingCondition.VERY_GOOD:
                return 4;
        }
    }
}