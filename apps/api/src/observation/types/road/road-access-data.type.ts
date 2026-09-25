import { RoadAccessibility } from "./road-accessibility.type.js";
import { RoadCondition } from './road-condition.type.js';

export type RoadAccessData = {
  condition: RoadCondition;
  accessibility: RoadAccessibility[];
};