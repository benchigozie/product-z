import { DrainageBlockage } from './drainage-blockage.type.js';
import { DrainageCondition } from './drainage-condition.type.js';

export type DrainageData = {
  condition: DrainageCondition;
  blockage?: DrainageBlockage;
};