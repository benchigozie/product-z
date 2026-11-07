import { Injectable } from '@nestjs/common';

import { SanitationCondition } from '../../../observation/types/sanitation/sanitation-condition.type.js';
import type { SanitationClaimData } from '../types/sanitation-claim-data.type.js';
import type { SanitationClaimAgreementResult } from '../types/sanitation-claim-agreement.type.js';

@Injectable()
export class SanitationClaimAgreementService {
    compare(
        first: SanitationClaimData,
        second: SanitationClaimData,
    ): SanitationClaimAgreementResult {
        return {
            conditionDifference: Math.abs(
                this.conditionValue(first.condition) -
                    this.conditionValue(second.condition),
            ),
        };
    }

    private conditionValue(condition: SanitationCondition): number {
        switch (condition) {
            case SanitationCondition.CLEAN:
                return 0;
            case SanitationCondition.FAIR:
                return 1;
            case SanitationCondition.POOR:
                return 2;
            case SanitationCondition.VERY_POOR:
                return 3;
        }
    }
}