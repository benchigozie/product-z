import { Injectable } from '@nestjs/common';

import { Availability } from '../observation/types/common/availability.type.js';
import { Reliability } from '../observation/types/common/reliability.type.js';
import type { PowerData } from '../observation/types/power/power-data.type.js';

import type { PowerAgreementResult } from './evidence/power-agreement.js';

@Injectable()
export class PowerAgreementService {
    compare(
        first: PowerData,
        second: PowerData,
    ): PowerAgreementResult {
        const availabilityDifference =
            Math.abs(
                this.availabilityValue(first.availability) -
                this.availabilityValue(second.availability),
            );

        const reliabilityDifference =
            first.reliability !== undefined &&
            second.reliability !== undefined
                ? Math.abs(
                    this.reliabilityValue(first.reliability) -
                    this.reliabilityValue(second.reliability),
                )
                : null;

        return {
            availabilityDifference,
            reliabilityDifference,
        };
    }

    private availabilityValue(
        availability: Availability,
    ): number {
        switch (availability) {
            case Availability.AVAILABLE:
                return 0;

            case Availability.INTERMITTENT:
                return 1;

            case Availability.UNAVAILABLE:
                return 2;
        }
    }

    private reliabilityValue(
        reliability: Reliability,
    ): number {
        switch (reliability) {
            case Reliability.VERY_POOR:
                return 0;

            case Reliability.POOR:
                return 1;

            case Reliability.FAIR:
                return 2;

            case Reliability.GOOD:
                return 3;

            case Reliability.EXCELLENT:
                return 4;
        }
    }
}