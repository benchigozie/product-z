import { SecurityAccessControl } from './security-access-control.type.js';
import { SecurityFeature } from './security-feature.type.js';
import { SecurityPersonnel } from './security-personnel.type.js';

export type SecurityData = {
  accessControl?: SecurityAccessControl;
  personnel?: SecurityPersonnel;
  features?: SecurityFeature[];
};