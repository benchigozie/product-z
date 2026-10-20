import { describe, expect, it } from 'vitest';

import { Availability } from '../../../observation/types/common/availability.type.js';
import { PowerSource } from '../../../observation/types/power/power-data.type.js';
import { PowerClaimAgreementService } from '../strategies/power-claim-agreement.service.js';
import type { PowerClaimData } from '../types/power-claim-data.type.js';

describe('PowerClaimAgreementService', () => {
    const service = new PowerClaimAgreementService();

    it('identifies matching source combinations and availability', () => {
        const first: PowerClaimData = {
            source: [PowerSource.GRID],
            availability: Availability.AVAILABLE,
        };

        const second: PowerClaimData = {
            source: [PowerSource.GRID],
            availability: Availability.AVAILABLE,
        };

        expect(service.compare(first, second)).toEqual({
            sourceMatch: true,
            availabilityDifference: 0,
        });
    });

    it('calculates an availability difference of one', () => {
        const first: PowerClaimData = {
            source: [PowerSource.GRID],
            availability: Availability.AVAILABLE,
        };

        const second: PowerClaimData = {
            source: [PowerSource.GRID],
            availability: Availability.INTERMITTENT,
        };

        expect(service.compare(first, second)).toEqual({
            sourceMatch: true,
            availabilityDifference: 1,
        });
    });

    it('calculates an availability difference of two', () => {
        const first: PowerClaimData = {
            source: [PowerSource.GRID],
            availability: Availability.AVAILABLE,
        };

        const second: PowerClaimData = {
            source: [PowerSource.GRID],
            availability: Availability.UNAVAILABLE,
        };

        expect(service.compare(first, second)).toEqual({
            sourceMatch: true,
            availabilityDifference: 2,
        });
    });

    it('treats source ordering as irrelevant', () => {
        const first: PowerClaimData = {
            source: [
                PowerSource.GRID,
                PowerSource.GENERATOR,
            ],
            availability: Availability.AVAILABLE,
        };

        const second: PowerClaimData = {
            source: [
                PowerSource.GENERATOR,
                PowerSource.GRID,
            ],
            availability: Availability.AVAILABLE,
        };

        expect(service.compare(first, second)).toEqual({
            sourceMatch: true,
            availabilityDifference: 0,
        });
    });

    it('identifies different source combinations', () => {
        const first: PowerClaimData = {
            source: [PowerSource.GRID],
            availability: Availability.AVAILABLE,
        };

        const second: PowerClaimData = {
            source: [PowerSource.GENERATOR],
            availability: Availability.AVAILABLE,
        };

        expect(service.compare(first, second)).toEqual({
            sourceMatch: false,
            availabilityDifference: 0,
        });
    });

    it('does not treat a multi-source claim as the same as a single-source claim', () => {
        const first: PowerClaimData = {
            source: [
                PowerSource.GRID,
                PowerSource.GENERATOR,
            ],
            availability: Availability.AVAILABLE,
        };

        const second: PowerClaimData = {
            source: [PowerSource.GRID],
            availability: Availability.AVAILABLE,
        };

        expect(service.compare(first, second)).toEqual({
            sourceMatch: false,
            availabilityDifference: 0,
        });
    });
});