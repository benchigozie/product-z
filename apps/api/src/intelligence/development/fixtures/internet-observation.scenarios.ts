import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import { Availability } from '../../../observation/types/common/availability.type.js';
import { Reliability } from '../../../observation/types/common/reliability.type.js';
import { Coverage } from '../../../observation/types/internet/coverage.type.js';
import { InternetConnectionType } from '../../../observation/types/internet/internet-connection-type.type.js';
import type { InternetData } from '../../../observation/types/internet/internet-data.type.js';
import { daysAgo } from './relative-date.helper.js';

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
            daysAgo(13),
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
            daysAgo(16),
        ),
        internetObservation(
            'cmockinternet0000000000003',
            {
                provider: 'Spectranet',
                connectionType: InternetConnectionType.FIXED_WIRELESS,
                availability: Availability.AVAILABLE,
                reliability: Reliability.FAIR,
            },
            daysAgo(21),
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
            daysAgo(11),
        ),
        internetObservation(
            'cmockinternet0000000000005',
            {
                provider: 'MTN',
                connectionType: InternetConnectionType.MOBILE_DATA,
                availability: Availability.UNAVAILABLE,
                coverage: Coverage.POOR,
            },
            daysAgo(12),
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
            daysAgo(118),
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
            daysAgo(61),
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
            daysAgo(16),
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
            daysAgo(605),
        ),
        internetObservation(
            'cmockinternet0000000000010',
            {
                provider: 'Spectranet',
                connectionType: InternetConnectionType.FIXED_WIRELESS,
                availability: Availability.AVAILABLE,
                reliability: Reliability.GOOD,
            },
            daysAgo(574),
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
            daysAgo(13),
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
            daysAgo(13),
        ),
        internetObservation(
            'cmockinternet0000000000013',
            {
                provider: 'MTN',
                connectionType: InternetConnectionType.MOBILE_DATA,
                availability: Availability.AVAILABLE,
                reliability: Reliability.FAIR,
            },
            daysAgo(16),
        ),
    ],
};

export type InternetObservationScenarioName = keyof typeof scenarios;

export const internetObservationScenarios: Record<
    string,
    ObservationListResult
> = scenarios;