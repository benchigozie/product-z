import type { RoadAccessibility } from '../../../observation/types/road/road-accessibility.type.js';
import type { RoadCondition } from '../../../observation/types/road/road-condition.type.js';

export interface RoadAccessClaimData {
    condition: RoadCondition;
    maxAccessibility: RoadAccessibility;
}