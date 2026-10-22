import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import { Availability } from '../../../observation/types/common/availability.type.js';
import { Reliability } from '../../../observation/types/common/reliability.type.js';
import { WaterSource } from '../../../observation/types/water/water-source.type.js';
import type { WaterData } from '../../../observation/types/water/water-data.type.js';

function waterObservation(
    id: string,
    data: WaterData,
    observedAt: string,
): ObservationListResult[number] {
    return {
        id,
        category: ObservationCategory.WATER,
        propertyId: 'cmockwaterproperty0000000001',
        placeId: null,
        data,
        description: 'Water supply observation fixture.',
        observedAt: new Date(observedAt),
        userId: null,
        createdAt: new Date('2026-10-20T12:00:00.000Z'),
        updatedAt: new Date('2026-10-20T12:00:00.000Z'),
        interpretation: null,
    };
}

const scenarios: Record<string, ObservationListResult> = {
    strongAgreement: [
        waterObservation(
            'cmockwater00000000000001',
            {
                source: [WaterSource.BOREHOLE],
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
            },
            '2026-10-15T12:00:00.000Z',
        ),
        waterObservation(
            'cmockwater00000000000002',
            {
                source: [WaterSource.BOREHOLE],
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
            },
            '2026-10-12T12:00:00.000Z',
        ),
        waterObservation(
            'cmockwater00000000000003',
            {
                source: [WaterSource.BOREHOLE],
                availability: Availability.AVAILABLE,
                reliability: Reliability.FAIR,
            },
            '2026-10-08T12:00:00.000Z',
        ),
    ],

    recentContradiction: [
        waterObservation(
            'cmockwater00000000000004',
            {
                source: [WaterSource.PUBLIC_SUPPLY],
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
            },
            '2026-10-17T12:00:00.000Z',
        ),
        waterObservation(
            'cmockwater00000000000005',
            {
                source: [WaterSource.PUBLIC_SUPPLY],
                availability: Availability.UNAVAILABLE,
                reliability: Reliability.VERY_POOR,
            },
            '2026-10-16T12:00:00.000Z',
        ),
    ],

    possibleImprovement: [
        waterObservation(
            'cmockwater00000000000006',
            {
                source: [WaterSource.PUBLIC_SUPPLY],
                availability: Availability.UNAVAILABLE,
                reliability: Reliability.VERY_POOR,
            },
            '2026-07-15T12:00:00.000Z',
        ),
        waterObservation(
            'cmockwater00000000000007',
            {
                source: [WaterSource.BOREHOLE],
                availability: Availability.INTERMITTENT,
                reliability: Reliability.FAIR,
            },
            '2026-09-20T12:00:00.000Z',
        ),
        waterObservation(
            'cmockwater00000000000008',
            {
                source: [WaterSource.BOREHOLE],
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
            },
            '2026-10-15T12:00:00.000Z',
        ),
    ],

    staleEvidence: [
        waterObservation(
            'cmockwater00000000000009',
            {
                source: [WaterSource.WELL],
                availability: Availability.UNAVAILABLE,
                reliability: Reliability.VERY_POOR,
            },
            '2025-08-15T12:00:00.000Z',
        ),
        waterObservation(
            'cmockwater00000000000010',
            {
                source: [WaterSource.WELL],
                availability: Availability.UNAVAILABLE,
                reliability: Reliability.POOR,
            },
            '2025-09-15T12:00:00.000Z',
        ),
    ],

    incompleteEvidence: [
        waterObservation(
            'cmockwater00000000000011',
            {
                source: [WaterSource.WATER_VENDOR],
                availability: Availability.INTERMITTENT,
            },
            '2026-10-15T12:00:00.000Z',
        ),
    ],

    multipleWaterSources: [
        waterObservation(
            'cmockwater00000000000012',
            {
                source: [
                    WaterSource.BOREHOLE,
                    WaterSource.RAINWATER,
                ],
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
            },
            '2026-10-15T12:00:00.000Z',
        ),
    ],
};

export type WaterObservationScenarioName = keyof typeof scenarios;

export const waterObservationScenarios: Record<
    WaterObservationScenarioName,
    ObservationListResult
> = scenarios;