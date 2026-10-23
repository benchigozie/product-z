import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import { Severity } from '../../../observation/types/common/severity.type.js';
import { FloodingOccurrence } from '../../../observation/types/flooding/flooding-occurrence.type.js';
import { FloodingExtent } from '../../../observation/types/flooding/flooding-extent.type.js';
import type { FloodingData } from '../../../observation/types/flooding/flooding-data.type.js';

function floodingObservation(
    id: string,
    data: FloodingData,
    observedAt: string,
): ObservationListResult[number] {
    return {
        id,
        category: ObservationCategory.FLOODING,
        propertyId: 'cmockfloodingproperty0000001',
        placeId: null,
        data,
        description: 'Flooding observation fixture.',
        observedAt: new Date(observedAt),
        userId: null,
        createdAt: new Date('2026-10-23T12:00:00.000Z'),
        updatedAt: new Date('2026-10-23T12:00:00.000Z'),
        interpretation: null,
    };
}

export const floodingObservationScenarios: Record<string, ObservationListResult> = {
    strongAgreement: [
        floodingObservation(
            'cmockflooding0000000000001',
            {
                occurrence: FloodingOccurrence.FLOODING_OBSERVED,
                extent: FloodingExtent.STREET,
                severity: Severity.MODERATE,
            },
            '2026-10-15T12:00:00.000Z',
        ),
        floodingObservation(
            'cmockflooding0000000000002',
            {
                occurrence: FloodingOccurrence.FLOODING_OBSERVED,
                extent: FloodingExtent.IMMEDIATE_ACCESS,
                severity: Severity.MODERATE,
            },
            '2026-10-10T12:00:00.000Z',
        ),
        floodingObservation(
            'cmockflooding0000000000003',
            {
                occurrence: FloodingOccurrence.FLOODING_OBSERVED,
                extent: FloodingExtent.STREET,
                severity: Severity.MINOR,
            },
            '2026-10-05T12:00:00.000Z',
        ),
    ],

    recentContradiction: [
        floodingObservation(
            'cmockflooding0000000000004',
            {
                occurrence: FloodingOccurrence.FLOODING_OBSERVED,
                extent: FloodingExtent.STREET,
                severity: Severity.MODERATE,
            },
            '2026-10-20T12:00:00.000Z',
        ),
        floodingObservation(
            'cmockflooding0000000000005',
            {
                occurrence: FloodingOccurrence.NO_FLOODING_OBSERVED,
                extent: FloodingExtent.PROPERTY,
            },
            '2026-10-19T12:00:00.000Z',
        ),
    ],

    possibleImprovement: [
        floodingObservation(
            'cmockflooding0000000000006',
            {
                occurrence: FloodingOccurrence.FLOODING_OBSERVED,
                extent: FloodingExtent.PROPERTY,
                severity: Severity.SEVERE,
            },
            '2026-07-15T12:00:00.000Z',
        ),
        floodingObservation(
            'cmockflooding0000000000007',
            {
                occurrence: FloodingOccurrence.EVIDENCE_OF_PAST_FLOODING,
                extent: FloodingExtent.STREET,
                severity: Severity.MODERATE,
            },
            '2026-09-10T12:00:00.000Z',
        ),
        floodingObservation(
            'cmockflooding0000000000008',
            {
                occurrence: FloodingOccurrence.NO_FLOODING_OBSERVED,
                extent: FloodingExtent.PROPERTY,
            },
            '2026-10-15T12:00:00.000Z',
        ),
    ],

    staleEvidence: [
        floodingObservation(
            'cmockflooding0000000000009',
            {
                occurrence: FloodingOccurrence.FLOODING_OBSERVED,
                extent: FloodingExtent.PROPERTY,
                severity: Severity.SEVERE,
            },
            '2025-03-15T12:00:00.000Z',
        ),
        floodingObservation(
            'cmockflooding0000000000010',
            {
                occurrence: FloodingOccurrence.FLOODING_OBSERVED,
                extent: FloodingExtent.STREET,
                severity: Severity.MODERATE,
            },
            '2025-04-15T12:00:00.000Z',
        ),
    ],

    incompleteEvidence: [
        floodingObservation(
            'cmockflooding0000000000011',
            {
                occurrence: FloodingOccurrence.EVIDENCE_OF_PAST_FLOODING,
                extent: FloodingExtent.STREET,
            },
            '2026-10-15T12:00:00.000Z',
        ),
    ],

    signsOnly: [
        floodingObservation(
            'cmockflooding0000000000012',
            {
                occurrence: FloodingOccurrence.EVIDENCE_OF_PAST_FLOODING,
                extent: FloodingExtent.STREET,
                severity: Severity.MINOR,
                conditions: 'Visible water marks on the exterior wall.',
            },
            '2026-10-15T12:00:00.000Z',
        ),
        floodingObservation(
            'cmockflooding0000000000013',
            {
                occurrence: FloodingOccurrence.EVIDENCE_OF_PAST_FLOODING,
                extent: FloodingExtent.IMMEDIATE_ACCESS,
                conditions: 'Damp patch on the ground floor.',
            },
            '2026-10-08T12:00:00.000Z',
        ),
    ],
};

export type FloodingObservationScenarioName = keyof typeof floodingObservationScenarios;
// becomes 'string' — that's fine