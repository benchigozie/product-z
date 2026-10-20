import { Injectable } from '@nestjs/common';

import { Availability } from '../../../observation/types/common/availability.type.js';
import type { PowerClaimData } from '../types/power-claim-data.type.js';
import type { PowerClaimAgreementResult } from '../types/power-claim-agreement.js';

@Injectable()
export class PowerClaimAgreementService {
    compare(
        first: PowerClaimData,
        second: PowerClaimData,
    ): PowerClaimAgreementResult {
        const firstSources = this.normalizeSources(first.source);
        const secondSources = this.normalizeSources(second.source);

        const sourceMatch =
            firstSources.length === secondSources.length &&
            firstSources.every(
                (source, index) => source === secondSources[index],
            );

        const availabilityDifference =
            Math.abs(
                this.availabilityValue(first.availability) -
                this.availabilityValue(second.availability),
            );

        return {
            sourceMatch,
            availabilityDifference,
        };
    }

    private normalizeSources(
        sources: PowerClaimData['source'],
    ): string[] {
        return [...new Set(sources)].sort();
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
}