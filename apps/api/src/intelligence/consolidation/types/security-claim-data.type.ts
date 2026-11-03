import type { SecurityAccessControl } from '../../../observation/types/security/security-access-control.type.js';
import type { SecurityPersonnel } from '../../../observation/types/security/security-personnel.type.js';

export interface SecurityClaimData {
    accessControl?: SecurityAccessControl;
    personnel?: SecurityPersonnel;
}