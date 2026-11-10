import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import { SecurityAccessControl } from '../../../observation/types/security/security-access-control.type.js';
import { SecurityPersonnel } from '../../../observation/types/security/security-personnel.type.js';
import { SecurityFeature } from '../../../observation/types/security/security-feature.type.js';
import type { SecurityData } from '../../../observation/types/security/security-data.type.js';
import { daysAgo } from './relative-date.helper.js';

function securityObservation(
    id: string,
    data: SecurityData,
    observedAt: string,
): ObservationListResult[number] {
    return {
        id,
        category: ObservationCategory.SECURITY,
        propertyId: 'cmocksecurityproperty00000001',
        placeId: null,
        data,
        description: 'Security observation fixture.',
        observedAt: new Date(observedAt),
        userId: null,
        createdAt: new Date('2026-11-03T12:00:00.000Z'),
        updatedAt: new Date('2026-11-03T12:00:00.000Z'),
        interpretation: null,
    };
}

const scenarios: Record<string, ObservationListResult> = {
    strongAgreement: [
        securityObservation(
            'cmocksecurity0000000000001',
            {
                accessControl: SecurityAccessControl.RESTRICTED_ACCESS,
                personnel: SecurityPersonnel.PRESENT,
                features: [
                    SecurityFeature.GATE,
                    SecurityFeature.GUARD_POST,
                ],
            },
            daysAgo(13),
        ),
        securityObservation(
            'cmocksecurity0000000000002',
            {
                accessControl: SecurityAccessControl.RESTRICTED_ACCESS,
                personnel: SecurityPersonnel.PRESENT,
                features: [SecurityFeature.GATE, SecurityFeature.CCTV],
            },
            daysAgo(16),
        ),
        securityObservation(
            'cmocksecurity0000000000003',
            {
                accessControl: SecurityAccessControl.RESTRICTED_ACCESS,
                personnel: SecurityPersonnel.PRESENT,
                features: [SecurityFeature.GATE],
            },
            daysAgo(21),
        ),
    ],

    recentContradiction: [
        securityObservation(
            'cmocksecurity0000000000004',
            {
                accessControl: SecurityAccessControl.RESTRICTED_ACCESS,
                personnel: SecurityPersonnel.PRESENT,
                features: [SecurityFeature.GATE, SecurityFeature.GUARD_POST],
            },
            daysAgo(11),
        ),
        securityObservation(
            'cmocksecurity0000000000005',
            {
                accessControl: SecurityAccessControl.OPEN_ACCESS,
                personnel: SecurityPersonnel.NONE_OBSERVED,
                features: [],
            },
            daysAgo(12),
        ),
    ],

    possibleImprovement: [
        securityObservation(
            'cmocksecurity0000000000006',
            {
                accessControl: SecurityAccessControl.OPEN_ACCESS,
                personnel: SecurityPersonnel.NONE_OBSERVED,
            },
            daysAgo(118),
        ),
        securityObservation(
            'cmocksecurity0000000000007',
            {
                accessControl: SecurityAccessControl.CONTROLLED_ACCESS,
                personnel: SecurityPersonnel.PRESENT,
            },
            daysAgo(61),
        ),
        securityObservation(
            'cmocksecurity0000000000008',
            {
                accessControl: SecurityAccessControl.RESTRICTED_ACCESS,
                personnel: SecurityPersonnel.PRESENT,
                features: [SecurityFeature.GATE, SecurityFeature.CCTV],
            },
            daysAgo(16),
        ),
    ],

    staleEvidence: [
        securityObservation(
            'cmocksecurity0000000000009',
            {
                accessControl: SecurityAccessControl.OPEN_ACCESS,
                personnel: SecurityPersonnel.NONE_OBSERVED,
            },
            daysAgo(605),
        ),
        securityObservation(
            'cmocksecurity0000000000010',
            {
                accessControl: SecurityAccessControl.OPEN_ACCESS,
                personnel: SecurityPersonnel.NONE_OBSERVED,
            },
            daysAgo(574),
        ),
    ],

    incompleteEvidence: [
        securityObservation(
            'cmocksecurity0000000000011',
            {
                accessControl: SecurityAccessControl.CONTROLLED_ACCESS,
                personnel: SecurityPersonnel.PRESENT,
            },
            daysAgo(13),
        ),
    ],

    mixedPersonnel: [
        securityObservation(
            'cmocksecurity0000000000012',
            {
                accessControl: SecurityAccessControl.RESTRICTED_ACCESS,
                personnel: SecurityPersonnel.PRESENT,
                features: [SecurityFeature.GATE],
            },
            daysAgo(11),
        ),
        securityObservation(
            'cmocksecurity0000000000013',
            {
                accessControl: SecurityAccessControl.RESTRICTED_ACCESS,
                personnel: SecurityPersonnel.NONE_OBSERVED,
                features: [SecurityFeature.GATE],
            },
            daysAgo(16),
        ),
        securityObservation(
            'cmocksecurity0000000000014',
            {
                accessControl: SecurityAccessControl.RESTRICTED_ACCESS,
                personnel: SecurityPersonnel.PRESENT,
                features: [SecurityFeature.GATE],
            },
            daysAgo(21),
        ),
    ],
};

export type SecurityObservationScenarioName = keyof typeof scenarios;

export const securityObservationScenarios: Record<
    string,
    ObservationListResult
> = scenarios;