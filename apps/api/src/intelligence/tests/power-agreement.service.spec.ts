import { describe, expect, it } from 'vitest';

import { Availability } from '../../observation/types/common/availability.type.js';
import { Reliability } from '../../observation/types/common/reliability.type.js';
import { PowerSource } from '../../observation/types/power/power-data.type.js';

import { AvailabilityAgreementService } from '../evidence/availability-agreement.service.js';
import { PowerAgreementService } from '../power-agreement.service.js';

describe('PowerAgreementService', () => {
    const core = new AvailabilityAgreementService();
    const service = new PowerAgreementService(core);

    it('delegates compare() to AvailabilityAgreementService', () => {
        const first = {
            source: [PowerSource.GRID],
            availability: Availability.AVAILABLE,
            reliability: Reliability.GOOD,
        };
        const second = {
            source: [PowerSource.GENERATOR],
            availability: Availability.UNAVAILABLE,
            reliability: Reliability.VERY_POOR,
        };

        expect(service.compare(first, second)).toEqual(
            core.compare(first, second),
        );
    });
});