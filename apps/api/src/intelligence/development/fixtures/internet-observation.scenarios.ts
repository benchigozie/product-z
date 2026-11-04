import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import { Availability } from '../../../observation/types/common/availability.type.js';
import { Reliability } from '../../../observation/types/common/reliability.type.js';
import { Coverage } from '../../../observation/types/internet/coverage.type.js';
import { InternetConnectionType } from '../../../observation/types/internet/internet-connection-type.type.js';
import type { InternetData } from '../../../observation/types/internet/internet-data.type.js';

function internetObservation(
    id: string,
    data: InternetData,
    observedAt: string,
): ObservationListResult[number] {
    return {
        id,
        category: ObservationCategory.INTERNET,
        propertyId: 'cmockinternetproperty00000001',
        placeId: null,
        data,
        description: 'Internet observation fixture.',
        observedAt: new Date(observedAt),
        userId: null,
        createdAt: new Date('2026-11-04T12:00:00.000Z'),
        updatedAt: new Date('2026-11-04T12:00:00.000Z'),
        interpretation: null,
    };
}

const scenarios: Record<string, ObservationListResult> = {
    strongAgreement: [
        internetObservation(
            'cmockinternet0000000000001',
            {
                provider: 'Spectranet',
                connectionType: InternetConnectionType.FIXED_WIRELESS,
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
                coverage: Coverage.GOOD,
            },
            '2026-10-28T12:00:00.000Z',
        ),
        internetObservation(
            'cmockinternet0000000000002',
            {
                provider: 'Spectranet',
                connectionType: InternetConnectionType.FIXED_WIRELESS,
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
                coverage: Coverage.GOOD,
            },
            '2026-10-25T12:00:00.000Z',
        ),
        internetObservation(
            'cmockinternet0000000000003',
            {
                provider: 'Spectranet',
                connectionType: InternetConnectionType.FIXED_WIRELESS,
                availability: Availability.AVAILABLE,
                reliability: Reliability.FAIR,
            },
            '2026-10-20T12:00:00.000Z',
        ),
    ],

    recentContradiction: [
        internetObservation(
            'cmockinternet0000000000004',
            {
                provider: 'MTN',
                connectionType: InternetConnectionType.MOBILE_DATA,
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
                coverage: Coverage.GOOD,
            },
            '2026-10-30T12:00:00.000Z',
        ),
        internetObservation(
            'cmockinternet0000000000005',
            {
                provider: 'MTN',
                connectionType: InternetConnectionType.MOBILE_DATA,
                availability: Availability.UNAVAILABLE,
                coverage: Coverage.POOR,
            },
            '2026-10-29T12:00:00.000Z',
        ),
    ],

    possibleImprovement: [
        internetObservation(
            'cmockinternet0000000000006',
            {
                provider: 'MTN',
                connectionType: InternetConnectionType.MOBILE_DATA,
                availability: Availability.UNAVAILABLE,
                coverage: Coverage.POOR,
            },
            '2026-07-15T12:00:00.000Z',
        ),
        internetObservation(
            'cmockinternet0000000000007',
            {
                provider: 'MTN',
                connectionType: InternetConnectionType.MOBILE_DATA,
                availability: Availability.INTERMITTENT,
                reliability: Reliability.FAIR,
                coverage: Coverage.FAIR,
            },
            '2026-09-10T12:00:00.000Z',
        ),
        internetObservation(
            'cmockinternet0000000000008',
            {
                provider: 'MTN',
                connectionType: InternetConnectionType.MOBILE_DATA,
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
                coverage: Coverage.GOOD,
            },
            '2026-10-25T12:00:00.000Z',
        ),
    ],

    staleEvidence: [
        internetObservation(
            'cmockinternet0000000000009',
            {
                provider: 'Spectranet',
                connectionType: InternetConnectionType.FIXED_WIRELESS,
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
            },
            '2025-03-15T12:00:00.000Z',
        ),
        internetObservation(
            'cmockinternet0000000000010',
            {
                provider: 'Spectranet',
                connectionType: InternetConnectionType.FIXED_WIRELESS,
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
            },
            '2025-04-15T12:00:00.000Z',
        ),
    ],

    incompleteEvidence: [
        internetObservation(
            'cmockinternet0000000000011',
            {
                provider: 'Starlink',
                connectionType: InternetConnectionType.SATELLITE,
                availability: Availability.INTERMITTENT,
                reliability: Reliability.FAIR,
                coverage: Coverage.FAIR,
            },
            '2026-10-28T12:00:00.000Z',
        ),
    ],

    multipleConnectionTypes: [
        internetObservation(
            'cmockinternet0000000000012',
            {
                provider: 'Spectranet',
                connectionType: InternetConnectionType.FIXED_WIRELESS,
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
            },
            '2026-10-28T12:00:00.000Z',
        ),
        internetObservation(
            'cmockinternet0000000000013',
            {
                provider: 'MTN',
                connectionType: InternetConnectionType.MOBILE_DATA,
                availability: Availability.AVAILABLE,
                reliability: Reliability.FAIR,
            },
            '2026-10-25T12:00:00.000Z',
        ),
    ],
};

export type InternetObservationScenarioName = keyof typeof scenarios;

export const internetObservationScenarios: Record<
    string,
    ObservationListResult
> = scenarios;