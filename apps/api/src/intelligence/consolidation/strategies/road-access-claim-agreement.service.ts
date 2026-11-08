import { Injectable } from '@nestjs/common';

import { RoadAccessibility } from '../../../observation/types/road/road-accessibility.type.js';
import { RoadCondition } from '../../../observation/types/road/road-condition.type.js';
import type { RoadAccessClaimData } from '../types/road-access-claim-data.type.js';
import type { RoadAccessClaimAgreementResult } from '../types/road-access-claim-agreement.type.js';

@Injectable()
export class RoadAccessClaimAgreementService {
    compare(
        first: RoadAccessClaimData,
        second: RoadAccessClaimData,
    ): RoadAccessClaimAgreementResult {
        return {
            accessibilityDifference: Math.abs(
                this.accessibilityValue(first.maxAccessibility) -
                    this.accessibilityValue(second.maxAccessibility),
            ),
            conditionDifference: Math.abs(
                this.conditionValue(first.condition) -
                    this.conditionValue(second.condition),
            ),
        };
    }

    private accessibilityValue(value: RoadAccessibility): number {
        switch (value) {
            case RoadAccessibility.WALKING:
                return 0;
            case RoadAccessibility.MOTORCYCLE:
                return 1;
            case RoadAccessibility.CAR:
                return 2;
            case RoadAccessibility.LARGE_VEHICLE:
                return 3;
        }
    }

    private conditionValue(value: RoadCondition): number {
        switch (value) {
            case RoadCondition.VERY_POOR:
                return 0;
            case RoadCondition.POOR:
                return 1;
            case RoadCondition.FAIR:
                return 2;
            case RoadCondition.GOOD:
                return 3;
            case RoadCondition.VERY_GOOD:
                return 4;
        }
    }
}