import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import { SanitationCondition } from '../../../observation/types/sanitation/sanitation-condition.type.js';
import type { SanitationData } from '../../../observation/types/sanitation/sanitation-data.type.js';

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
            '2026-10-30T12:00:00.000Z',
        ),
        sanitationObservation(
            'cmocksanitation000000000002',
            {
                condition: SanitationCondition.CLEAN,
                description: 'No visible waste or sanitation issues.',
            },
            '2026-10-25T12:00:00.000Z',
        ),
        sanitationObservation(
            'cmocksanitation000000000003',
            {
                condition: SanitationCondition.CLEAN,
            },
            '2026-10-20T12:00:00.000Z',
        ),
    ],

    recentContradiction: [
        sanitationObservation(
            'cmocksanitation000000000004',
            {
                condition: SanitationCondition.CLEAN,
                description: 'Area appears well-maintained.',
            },
            '2026-11-01T12:00:00.000Z',
        ),
        sanitationObservation(
            'cmocksanitation000000000005',
            {
                condition: SanitationCondition.VERY_POOR,
                description: 'Waste piled up, drains blocked.',
            },
            '2026-10-31T12:00:00.000Z',
        ),
    ],

    possibleImprovement: [
        sanitationObservation(
            'cmocksanitation000000000006',
            {
                condition: SanitationCondition.VERY_POOR,
                description: 'Waste management was poor.',
            },
            '2026-07-15T12:00:00.000Z',
        ),
        sanitationObservation(
            'cmocksanitation000000000007',
            {
                condition: SanitationCondition.FAIR,
                description: 'Improved collection frequency.',
            },
            '2026-09-10T12:00:00.000Z',
        ),
        sanitationObservation(
            'cmocksanitation000000000008',
            {
                condition: SanitationCondition.CLEAN,
            },
            '2026-10-25T12:00:00.000Z',
        ),
    ],

    staleEvidence: [
        sanitationObservation(
            'cmocksanitation000000000009',
            {
                condition: SanitationCondition.CLEAN,
            },
            '2025-03-15T12:00:00.000Z',
        ),
        sanitationObservation(
            'cmocksanitation000000000010',
            {
                condition: SanitationCondition.CLEAN,
            },
            '2025-04-15T12:00:00.000Z',
        ),
    ],

    incompleteEvidence: [
        sanitationObservation(
            'cmocksanitation000000000011',
            {
                condition: SanitationCondition.FAIR,
            },
            '2026-10-30T12:00:00.000Z',
        ),
    ],

    mixedConcerns: [
        sanitationObservation(
            'cmocksanitation000000000012',
            {
                condition: SanitationCondition.FAIR,
                description: 'Some litter visible but manageable.',
            },
            '2026-10-30T12:00:00.000Z',
        ),
        sanitationObservation(
            'cmocksanitation000000000013',
            {
                condition: SanitationCondition.POOR,
                description: 'Waste collection is inconsistent.',
            },
            '2026-10-25T12:00:00.000Z',
        ),
        sanitationObservation(
            'cmocksanitation000000000014',
            {
                condition: SanitationCondition.FAIR,
            },
            '2026-10-20T12:00:00.000Z',
        ),
    ],
};

export type SanitationObservationScenarioName = keyof typeof scenarios;

export const sanitationObservationScenarios: Record<
    string,
    ObservationListResult
> = scenarios;