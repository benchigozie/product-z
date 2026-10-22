import { Injectable } from '@nestjs/common';

import { Availability } from '../../../observation/types/common/availability.type.js';
import type { WaterClaimData } from '../types/water-claim-data.type.js';
import type { WaterClaimAgreementResult } from '../types/water-claim-agreement.js';

@Injectable()
export class WaterClaimAgreementService {
    compare(
        first: WaterClaimData,
        second: WaterClaimData,
    ): WaterClaimAgreementResult {
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
        sources: WaterClaimData['source'],
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