import { Injectable } from '@nestjs/common';

import { SecurityAccessControl } from '../../../observation/types/security/security-access-control.type.js';
import { SecurityPersonnel } from '../../../observation/types/security/security-personnel.type.js';
import type { SecurityClaimData } from '../types/security-claim-data.type.js';
import type { SecurityClaimAgreementResult } from '../types/security-claim-agreement.type.js';

@Injectable()
export class SecurityClaimAgreementService {
    compare(
        first: SecurityClaimData,
        second: SecurityClaimData,
    ): SecurityClaimAgreementResult {
        const accessControlDifference =
            first.accessControl === undefined ||
            second.accessControl === undefined
                ? -1
                : Math.abs(
                      this.accessControlValue(first.accessControl) -
                          this.accessControlValue(second.accessControl),
                  );

        const personnelDifference =
            first.personnel === undefined || second.personnel === undefined
                ? null
                : Math.abs(
                      this.personnelValue(first.personnel) -
                          this.personnelValue(second.personnel),
                  );

        return {
            accessControlDifference,
            personnelDifference,
        };
    }

    private accessControlValue(value: SecurityAccessControl): number {
        switch (value) {
            case SecurityAccessControl.OPEN_ACCESS:
                return 0;
            case SecurityAccessControl.CONTROLLED_ACCESS:
                return 1;
            case SecurityAccessControl.RESTRICTED_ACCESS:
                return 2;
        }
    }

    private personnelValue(value: SecurityPersonnel): number {
        switch (value) {
            case SecurityPersonnel.NONE_OBSERVED:
                return 0;
            case SecurityPersonnel.PRESENT:
                return 1;
        }
    }
}