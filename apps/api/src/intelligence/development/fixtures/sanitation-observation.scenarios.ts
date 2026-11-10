import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import { SanitationCondition } from '../../../observation/types/sanitation/sanitation-condition.type.js';
import type { SanitationData } from '../../../observation/types/sanitation/sanitation-data.type.js';
import { daysAgo } from './relative-date.helper.js';

function sanitationObservation(
    id: string,
    data: SanitationData,
    observedAt: string,
): ObservationListResult[number] {
    return {
        id,
        category: ObservationCategory.SANITATION,
        propertyId: 'cmocksanitationproperty000001',
        placeId: null,
        data,
        description: 'Sanitation observation fixture.',
        observedAt: new Date(observedAt),
        userId: null,
        createdAt: new Date('2026-11-06T12:00:00.000Z'),
        updatedAt: new Date('2026-11-06T12:00:00.000Z'),
        interpretation: null,
    };
}

const scenarios: Record<string, ObservationListResult> = {
    strongAgreement: [
        sanitationObservation(
            'cmocksanitation000000000001',
            {
                condition: SanitationCondition.CLEAN,
                description: 'Waste collected regularly, area kept clean.',
            },
            daysAgo(11),
        ),
        sanitationObservation(
            'cmocksanitation000000000002',
            {
                condition: SanitationCondition.CLEAN,
                description: 'No visible waste or sanitation issues.',
            },
            daysAgo(16),
        ),
        sanitationObservation(
            'cmocksanitation000000000003',
            {
                condition: SanitationCondition.CLEAN,
            },
            daysAgo(21),
        ),
    ],

    recentContradiction: [
        sanitationObservation(
            'cmocksanitation000000000004',
            {
                condition: SanitationCondition.CLEAN,
                description: 'Area appears well-maintained.',
            },
            daysAgo(9),
        ),
        sanitationObservation(
            'cmocksanitation000000000005',
            {
                condition: SanitationCondition.VERY_POOR,
                description: 'Waste piled up, drains blocked.',
            },
            daysAgo(10),
        ),
    ],

    possibleImprovement: [
        sanitationObservation(
            'cmocksanitation000000000006',
            {
                condition: SanitationCondition.VERY_POOR,
                description: 'Waste management was poor.',
            },
            daysAgo(118),
        ),
        sanitationObservation(
            'cmocksanitation000000000007',
            {
                condition: SanitationCondition.FAIR,
                description: 'Improved collection frequency.',
            },
            daysAgo(61),
        ),
        sanitationObservation(
            'cmocksanitation000000000008',
            {
                condition: SanitationCondition.CLEAN,
            },
            daysAgo(16),
        ),
    ],

    staleEvidence: [
        sanitationObservation(
            'cmocksanitation000000000009',
            {
                condition: SanitationCondition.CLEAN,
            },
            daysAgo(605),
        ),
        sanitationObservation(
            'cmocksanitation000000000010',
            {
                condition: SanitationCondition.CLEAN,
            },
            daysAgo(574),
        ),
    ],

    incompleteEvidence: [
        sanitationObservation(
            'cmocksanitation000000000011',
            {
                condition: SanitationCondition.FAIR,
            },
            daysAgo(11),
        ),
    ],

    mixedConcerns: [
        sanitationObservation(
            'cmocksanitation000000000012',
            {
                condition: SanitationCondition.FAIR,
                description: 'Some litter visible but manageable.',
            },
            daysAgo(11),
        ),
        sanitationObservation(
            'cmocksanitation000000000013',
            {
                condition: SanitationCondition.POOR,
                description: 'Waste collection is inconsistent.',
            },
            daysAgo(16),
        ),
        sanitationObservation(
            'cmocksanitation000000000014',
            {
                condition: SanitationCondition.FAIR,
            },
            daysAgo(21),
        ),
    ],
};

export type SanitationObservationScenarioName = keyof typeof scenarios;

export const sanitationObservationScenarios: Record<
    string,
    ObservationListResult
> = scenarios;