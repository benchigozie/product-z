import { Injectable } from '@nestjs/common';

import { RoadAccessibility } from '../../observation/types/road/road-accessibility.type.js';
import { RoadCondition } from '../../observation/types/road/road-condition.type.js';
import type { RoadAccessData } from '../../observation/types/road/road-access-data.type.js';
import type { RoadAccessAgreementResult } from './types/road-access-agreement.type.js';

@Injectable()
export class RoadAccessAgreementService {
    compare(
        first: RoadAccessData,
        second: RoadAccessData,
    ): RoadAccessAgreementResult {
        const firstMax = this.maxAccessibility(first.accessibility);
        const secondMax = this.maxAccessibility(second.accessibility);

        const accessibilityDifference = Math.abs(
            this.accessibilityValue(firstMax) -
                this.accessibilityValue(secondMax),
        );

        const conditionDifference = Math.abs(
            this.conditionValue(first.condition) -
                this.conditionValue(second.condition),
        );

        return {
            accessibilityDifference,
            conditionDifference,
        };
    }

    private maxAccessibility(
        values: RoadAccessibility[],
    ): RoadAccessibility {
        let max = RoadAccessibility.WALKING;
        let maxValue = this.accessibilityValue(max);

        for (const value of values) {
            const v = this.accessibilityValue(value);
            if (v > maxValue) {
                max = value;
                maxValue = v;
            }
        }

        return max;
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