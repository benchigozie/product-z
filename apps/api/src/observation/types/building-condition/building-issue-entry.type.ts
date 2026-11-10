import type { BuildingIssue } from './building-issue.type.js';
import type { BuildingComponent } from './building-component.type.js';

export interface BuildingIssueEntry {
    issue: BuildingIssue;
    component?: BuildingComponent;
}