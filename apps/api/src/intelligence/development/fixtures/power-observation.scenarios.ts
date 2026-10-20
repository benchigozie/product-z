
import {
    Availability,
} from '../../../observation/types/common/availability.type.js';

import {
    Reliability,
} from '../../../observation/types/common/reliability.type.js';

import {
    PowerSource,
} from '../../../observation/types/power/power-data.type.js';

import type {
    ObservationListResult,
} from '../../../observation/types/observation-result.type.js';

import {
    createPowerObservation,
} from './power-observation.factory.js';

type PowerObservationScenarios = {
    strongAgreement: ObservationListResult;
    recentContradiction: ObservationListResult;
    possibleImprovement: ObservationListResult;
    staleEvidence: ObservationListResult;
    incompleteEvidence: ObservationListResult;
    multiplePowerSources: ObservationListResult;
};

const NOW = new Date('2026-10-12T12:00:00.000Z');

function daysAgo(days: number): Date {
    return new Date(
        NOW.getTime() - days * 24 * 60 * 60 * 1000,
    );
}

export const powerObservationScenarios: PowerObservationScenarios = {
    strongAgreement: [
        createPowerObservation({
            id: 'cmockpower00000000000001',
            observedAt: daysAgo(5),
            availability: Availability.AVAILABLE,
            reliability: Reliability.POOR,
        }),
        createPowerObservation({
            id: 'cmockpower00000000000002',
            observedAt: daysAgo(8),
            availability: Availability.AVAILABLE,
            reliability: Reliability.POOR,
        }),
        createPowerObservation({
            id: 'cmockpower00000000000003',
            observedAt: daysAgo(12),
            availability: Availability.AVAILABLE,
            reliability: Reliability.FAIR,
        }),
    ],

    recentContradiction: [
        createPowerObservation({
            id: 'cmockpower00000000000004',
            observedAt: daysAgo(3),
            availability: Availability.AVAILABLE,
            reliability: Reliability.GOOD,
        }),
        createPowerObservation({
            id: 'cmockpower00000000000005',
            observedAt: daysAgo(4),
            availability: Availability.UNAVAILABLE,
            reliability: Reliability.VERY_POOR,
        }),
    ],

    possibleImprovement: [
        createPowerObservation({
            id: 'cmockpower00000000000006',
            observedAt: daysAgo(90),
            availability: Availability.UNAVAILABLE,
            reliability: Reliability.VERY_POOR,
        }),
        createPowerObservation({
            id: 'cmockpower00000000000007',
            observedAt: daysAgo(20),
            availability: Availability.INTERMITTENT,
            reliability: Reliability.POOR,
        }),
        createPowerObservation({
            id: 'cmockpower00000000000008',
            observedAt: daysAgo(5),
            availability: Availability.AVAILABLE,
            reliability: Reliability.FAIR,
        }),
    ],

    staleEvidence: [
        createPowerObservation({
            id: 'cmockpower00000000000009',
            observedAt: daysAgo(240),
            availability: Availability.UNAVAILABLE,
            reliability: Reliability.VERY_POOR,
        }),
        createPowerObservation({
            id: 'cmockpower00000000000010',
            observedAt: daysAgo(220),
            availability: Availability.UNAVAILABLE,
            reliability: Reliability.POOR,
        }),
    ],

    incompleteEvidence: [
        createPowerObservation({
            id: 'cmockpower00000000000011',
            observedAt: daysAgo(2),
            availability: Availability.INTERMITTENT,
            reliability: undefined,
        }),
    ],

    multiplePowerSources: [
        createPowerObservation({
            id: 'cmockpower00000000000012',
            observedAt: daysAgo(3),
            availability: Availability.AVAILABLE,
            reliability: Reliability.GOOD,
            source: [
                PowerSource.GRID,
                PowerSource.GENERATOR,
                PowerSource.INVERTER,
            ],
        }),
    ],
};
