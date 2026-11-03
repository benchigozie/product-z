import { Injectable } from '@nestjs/common';

import { SecurityAccessControl } from '../../observation/types/security/security-access-control.type.js';
import { SecurityPersonnel } from '../../observation/types/security/security-personnel.type.js';
import { SecurityFeature } from '../../observation/types/security/security-feature.type.js';
import type { SecurityData } from '../../observation/types/security/security-data.type.js';
import type { SecurityAgreementResult } from './types/security-agreement.type.js';

@Injectable()
export class SecurityAgreementService {
    compare(
        first: SecurityData,
        second: SecurityData,
    ): SecurityAgreementResult {
        const accessControlDifference = this.accessControlDifference(
            first.accessControl,
            second.accessControl,
        );

        const personnelDifference = this.personnelDifference(
            first.personnel,
            second.personnel,
        );

        const featuresOverlap = this.featuresOverlap(
            first.features,
            second.features,
        );

        return {
            accessControlDifference,
            personnelDifference,
            featuresOverlap,
        };
    }

    private accessControlDifference(
        first: SecurityAccessControl | undefined,
        second: SecurityAccessControl | undefined,
    ): number {
        if (first === undefined || second === undefined) {
            return -1;
        }
        return Math.abs(
            this.accessControlValue(first) -
                this.accessControlValue(second),
        );
    }

    private personnelDifference(
        first: SecurityPersonnel | undefined,
        second: SecurityPersonnel | undefined,
    ): number | null {
        if (first === undefined || second === undefined) {
            return null;
        }
        return Math.abs(
            this.personnelValue(first) - this.personnelValue(second),
        );
    }

    private featuresOverlap(
        first: SecurityFeature[] | undefined,
        second: SecurityFeature[] | undefined,
    ): number | null {
        if (
            first === undefined ||
            second === undefined ||
            first.length === 0 ||
            second.length === 0
        ) {
            return null;
        }

        const firstSet = new Set(first);
        const secondSet = new Set(second);

        let shared = 0;
        for (const feature of firstSet) {
            if (secondSet.has(feature)) shared++;
        }

        const union = new Set([...firstSet, ...secondSet]).size;
        return union === 0 ? null : shared / union;
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