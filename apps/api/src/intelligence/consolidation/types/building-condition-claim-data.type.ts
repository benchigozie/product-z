import type { BuildingCondition } from '../../../observation/types/building-condition/building-condition.type.js';
import type { BuildingComponent } from '../../../observation/types/building-condition/building-component.type.js';
import type { BuildingIssue } from '../../../observation/types/building-condition/building-issue.type.js';

export interface BuildingConditionClaimIssueEntry {
    issue: BuildingIssue;
    component?: BuildingComponent;
}

export interface BuildingConditionClaimData {
    condition: BuildingCondition;
    issues: BuildingConditionClaimIssueEntry[];
}