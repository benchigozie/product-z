import { describe, expect, it } from 'vitest';

import { Availability } from '../../observation/types/common/availability.type.js';
import { Reliability } from '../../observation/types/common/reliability.type.js';

import { AvailabilityAgreementService } from '../evidence/availability-agreement.service.js';

describe('AvailabilityAgreementService', () => {
    const service = new AvailabilityAgreementService();

    it('returns zero differences when availability and reliability match', () => {
        const result = service.compare(
            {
                availability: Availability.INTERMITTENT,
                reliability: Reliability.GOOD,
            },
            {
                availability: Availability.INTERMITTENT,
                reliability: Reliability.GOOD,
            },
        );

        expect(result).toEqual({
            availabilityDifference: 0,
            reliabilityDifference: 0,
        });
    });

    it('calculates the availability difference correctly', () => {
        const result = service.compare(
            { availability: Availability.AVAILABLE },
            { availability: Availability.UNAVAILABLE },
        );

        expect(result.availabilityDifference).toBe(2);
        expect(result.reliabilityDifference).toBeNull();
    });

    it('calculates the reliability difference correctly', () => {
        const result = service.compare(
            {
                availability: Availability.INTERMITTENT,
                reliability: Reliability.VERY_POOR,
            },
            {
                availability: Availability.INTERMITTENT,
                reliability: Reliability.EXCELLENT,
            },
        );

        expect(result).toEqual({
            availabilityDifference: 0,
            reliabilityDifference: 4,
        });
    });

    it('returns null for reliability difference when either observation omits reliability', () => {
        const result = service.compare(
            {
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
            },
            { availability: Availability.AVAILABLE },
        );

        expect(result.reliabilityDifference).toBeNull();
    });
});