import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import { RoadAccessibility } from '../../../observation/types/road/road-accessibility.type.js';
import { RoadCondition } from '../../../observation/types/road/road-condition.type.js';
import type { RoadAccessData } from '../../../observation/types/road/road-access-data.type.js';

function roadObservation(
    id: string,
    data: RoadAccessData,
    observedAt: string,
): ObservationListResult[number] {
    return {
        id,
        category: ObservationCategory.ROAD_ACCESS,
        propertyId: 'cmockroadaccessproperty000001',
        placeId: null,
        data,
        description: 'Road access observation fixture.',
        observedAt: new Date(observedAt),
        userId: null,
        createdAt: new Date('2026-11-07T12:00:00.000Z'),
        updatedAt: new Date('2026-11-07T12:00:00.000Z'),
        interpretation: null,
    };
}

const scenarios: Record<string, ObservationListResult> = {
    strongAgreement: [
        roadObservation(
            'cmockroadaccess000000000001',
            {
                condition: RoadCondition.GOOD,
                accessibility: [
                    RoadAccessibility.WALKING,
                    RoadAccessibility.MOTORCYCLE,
                    RoadAccessibility.CAR,
                ],
            },
            '2026-11-01T12:00:00.000Z',
        ),
        roadObservation(
            'cmockroadaccess000000000002',
            {
                condition: RoadCondition.FAIR,
                accessibility: [
                    RoadAccessibility.WALKING,
                    RoadAccessibility.MOTORCYCLE,
                    RoadAccessibility.CAR,
                ],
            },
            '2026-10-28T12:00:00.000Z',
        ),
        roadObservation(
            'cmockroadaccess000000000003',
            {
                condition: RoadCondition.GOOD,
                accessibility: [RoadAccessibility.WALKING, RoadAccessibility.CAR],
            },
            '2026-10-22T12:00:00.000Z',
        ),
    ],

    recentContradiction: [
        roadObservation(
            'cmockroadaccess000000000004',
            {
                condition: RoadCondition.GOOD,
                accessibility: [
                    RoadAccessibility.WALKING,
                    RoadAccessibility.MOTORCYCLE,
                    RoadAccessibility.CAR,
                ],
            },
            '2026-11-02T12:00:00.000Z',
        ),
        roadObservation(
            'cmockroadaccess000000000005',
            {
                condition: RoadCondition.VERY_POOR,
                accessibility: [RoadAccessibility.WALKING],
            },
            '2026-11-01T12:00:00.000Z',
        ),
    ],

    possibleImprovement: [
        roadObservation(
            'cmockroadaccess000000000006',
            {
                condition: RoadCondition.VERY_POOR,
                accessibility: [RoadAccessibility.WALKING],
            },
            '2026-07-15T12:00:00.000Z',
        ),
        roadObservation(
            'cmockroadaccess000000000007',
            {
                condition: RoadCondition.POOR,
                accessibility: [
                    RoadAccessibility.WALKING,
                    RoadAccessibility.MOTORCYCLE,
                ],
            },
            '2026-09-10T12:00:00.000Z',
        ),
        roadObservation(
            'cmockroadaccess000000000008',
            {
                condition: RoadCondition.FAIR,
                accessibility: [
                    RoadAccessibility.WALKING,
                    RoadAccessibility.MOTORCYCLE,
                    RoadAccessibility.CAR,
                ],
            },
            '2026-10-28T12:00:00.000Z',
        ),
    ],

    staleEvidence: [
        roadObservation(
            'cmockroadaccess000000000009',
            {
                condition: RoadCondition.GOOD,
                accessibility: [RoadAccessibility.WALKING, RoadAccessibility.CAR],
            },
            '2025-03-15T12:00:00.000Z',
        ),
        roadObservation(
            'cmockroadaccess000000000010',
            {
                condition: RoadCondition.GOOD,
                accessibility: [RoadAccessibility.WALKING, RoadAccessibility.CAR],
            },
            '2025-04-15T12:00:00.000Z',
        ),
    ],

    incompleteEvidence: [
        roadObservation(
            'cmockroadaccess000000000011',
            {
                condition: RoadCondition.FAIR,
                accessibility: [
                    RoadAccessibility.WALKING,
                    RoadAccessibility.MOTORCYCLE,
                    RoadAccessibility.CAR,
                ],
            },
            '2026-10-30T12:00:00.000Z',
        ),
    ],

    carAccessibleButPoor: [
        roadObservation(
            'cmockroadaccess000000000012',
            {
                condition: RoadCondition.POOR,
                accessibility: [
                    RoadAccessibility.WALKING,
                    RoadAccessibility.MOTORCYCLE,
                    RoadAccessibility.CAR,
                ],
            },
            '2026-11-01T12:00:00.000Z',
        ),
        roadObservation(
            'cmockroadaccess000000000013',
            {
                condition: RoadCondition.VERY_POOR,
                accessibility: [RoadAccessibility.WALKING, RoadAccessibility.CAR],
            },
            '2026-10-25T12:00:00.000Z',
        ),
    ],
};

export type RoadAccessObservationScenarioName = keyof typeof scenarios;

export const roadAccessObservationScenarios: Record<
    string,
    ObservationListResult
> = scenarios;