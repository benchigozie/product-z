import { ConstructionImpact } from './construction-impact.type.js';
import { ConstructionStatus } from './construction-status.type.js';

export type ConstructionData = {
  status: ConstructionStatus;
  impact?: ConstructionImpact;
  description?: string;
};