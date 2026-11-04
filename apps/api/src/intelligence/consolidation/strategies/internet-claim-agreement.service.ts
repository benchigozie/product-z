import { Injectable } from '@nestjs/common';

import { Availability } from '../../../observation/types/common/availability.type.js';
import type { InternetClaimData } from '../types/internet-claim-data.type.js';
import type { InternetClaimAgreementResult } from '../types/internet-claim-agreement.type.js';

@Injectable()
export class InternetClaimAgreementService {
    compare(
        first: InternetClaimData,
        second: InternetClaimData,
    ): InternetClaimAgreementResult {
        const connectionTypeMatch =
            first.connectionType === second.connectionType;

        const availabilityDifference = Math.abs(
            this.availabilityValue(first.availability) -
                this.availabilityValue(second.availability),
        );

        return {
            connectionTypeMatch,
            availabilityDifference,
        };
    }

    private availabilityValue(availability: Availability): number {
        switch (availability) {
            case Availability.AVAILABLE:
                return 0;
            case Availability.INTERMITTENT:
                return 1;
            case Availability.UNAVAILABLE:
                return 2;
        }
    }
}