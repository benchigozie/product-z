import { Injectable } from '@nestjs/common';

import { BuildingCondition } from '../../../observation/types/building-condition/building-condition.type.js';
import type { BuildingConditionClaimData } from '../types/building-condition-claim-data.type.js';
import type { BuildingConditionClaimAgreementResult } from '../types/building-condition-claim-agreement.type.js';

@Injectable()
export class BuildingConditionClaimAgreementService {
    compare(
        first: BuildingConditionClaimData,
        second: BuildingConditionClaimData,
    ): BuildingConditionClaimAgreementResult {
        return {
            conditionDifference: Math.abs(
                this.conditionValue(first.condition) -
                    this.conditionValue(second.condition),
            ),
        };
    }

    private conditionValue(value: BuildingCondition): number {
        switch (value) {
            case BuildingCondition.VERY_POOR:
                return 0;
            case BuildingCondition.POOR:
                return 1;
            case BuildingCondition.FAIR:
                return 2;
            case BuildingCondition.GOOD:
                return 3;
            case BuildingCondition.VERY_GOOD:
                return 4;
        }
    }
}