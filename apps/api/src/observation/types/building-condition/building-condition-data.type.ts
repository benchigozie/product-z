import type { BuildingCondition } from './building-condition.type.js';
import type { BuildingComponent } from './building-component.type.js';
import type { BuildingIssueEntry } from './building-issue-entry.type.js';

export type BuildingConditionData = {
    condition: BuildingCondition;
    issues: BuildingIssueEntry[];
    components: BuildingComponent[];
    description?: string;
};