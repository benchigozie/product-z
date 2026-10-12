import { describe, expect, it } from 'vitest';

import { Availability } from '../../observation/types/common/availability.type.js';
import { Reliability } from '../../observation/types/common/reliability.type.js';
import { PowerSource } from '../../observation/types/power/power-data.type.js';

import { PowerAgreementService } from '../power-agreement.service.js';
describe('PowerAgreementService', () => {
    const service = new PowerAgreementService();

    it('returns zero differences when availability and reliability match', () => {
        const result = service.compare(
            {
                source: [PowerSource.GRID],
                availability: Availability.INTERMITTENT,
                reliability: Reliability.GOOD,
            },
            {
                source: [PowerSource.GRID, PowerSource.GENERATOR],
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
            {
                source: [PowerSource.GRID],
                availability: Availability.AVAILABLE,
            },
            {
                source: [PowerSource.GRID],
                availability: Availability.UNAVAILABLE,
            },
        );

        expect(result.availabilityDifference).toBe(2);
        expect(result.reliabilityDifference).toBeNull();
    });

    it('calculates the reliability difference correctly', () => {
        const result = service.compare(
            {
                source: [PowerSource.GRID],
                availability: Availability.INTERMITTENT,
                reliability: Reliability.VERY_POOR,
            },
            {
                source: [PowerSource.GRID],
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
                source: [PowerSource.GRID],
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
            },
            {
                source: [PowerSource.GRID],
                availability: Availability.AVAILABLE,
            },
        );

        expect(result.reliabilityDifference).toBeNull();
    });
});