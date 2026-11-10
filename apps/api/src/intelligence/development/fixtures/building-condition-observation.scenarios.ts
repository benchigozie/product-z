import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import { BuildingCondition } from '../../../observation/types/building-condition/building-condition.type.js';
import { BuildingComponent } from '../../../observation/types/building-condition/building-component.type.js';
import { BuildingIssue } from '../../../observation/types/building-condition/building-issue.type.js';
import type { BuildingConditionData } from '../../../observation/types/building-condition/building-condition-data.type.js';
import { daysAgo } from './relative-date.helper.js';

function buildingObservation(
    id: string,
    data: BuildingConditionData,
    observedAt: string,
): ObservationListResult[number] {
    return {
        id,
        category: ObservationCategory.BUILDING_CONDITION,
        propertyId: 'cmockbuildingconditionproperty01',
        placeId: null,
        data: data as any,
        description: 'Building condition observation fixture.',
        observedAt: new Date(observedAt),
        userId: null,
        createdAt: new Date('2026-11-09T12:00:00.000Z'),
        updatedAt: new Date('2026-11-09T12:00:00.000Z'),
        interpretation: null,
    };
}

const scenarios: Record<string, ObservationListResult> = {
    strongAgreement: [
        buildingObservation(
            'cmockbuildingcondition000000001',
            {
                condition: BuildingCondition.GOOD,
                issues: [],
                components: [
                    BuildingComponent.WALLS,
                    BuildingComponent.CEILING,
                    BuildingComponent.FLOORS,
                ],
                description: 'Well maintained, no issues observed.',
            },
            daysAgo(9),
        ),
        buildingObservation(
            'cmockbuildingcondition000000002',
            {
                condition: BuildingCondition.GOOD,
                issues: [],
                components: [BuildingComponent.WALLS],
                description: 'Structure and walls in good condition.',
            },
            daysAgo(16),
        ),
        buildingObservation(
            'cmockbuildingcondition000000003',
            {
                condition: BuildingCondition.GOOD,
                issues: [],
                components: [],
            },
            daysAgo(21),
        ),
    ],

    recentContradiction: [
        buildingObservation(
            'cmockbuildingcondition000000004',
            {
                condition: BuildingCondition.GOOD,
                issues: [],
                components: [],
                description: 'No issues found during inspection.',
            },
            daysAgo(8),
        ),
        buildingObservation(
            'cmockbuildingcondition000000005',
            {
                condition: BuildingCondition.VERY_POOR,
                issues: [
                    {
                        issue: BuildingIssue.CRACKING,
                        component: BuildingComponent.WALLS,
                    },
                    {
                        issue: BuildingIssue.WATER_DAMAGE,
                        component: BuildingComponent.CEILING,
                    },
                ],
                components: [
                    BuildingComponent.WALLS,
                    BuildingComponent.CEILING,
                ],
                description:
                    'Major structural cracking and water damage in the ceiling.',
            },
            daysAgo(9),
        ),
    ],

    possibleImprovement: [
        buildingObservation(
            'cmockbuildingcondition000000006',
            {
                condition: BuildingCondition.VERY_POOR,
                issues: [
                    {
                        issue: BuildingIssue.LEAK,
                        component: BuildingComponent.ROOF,
                    },
                    {
                        issue: BuildingIssue.WATER_DAMAGE,
                        component: BuildingComponent.CEILING,
                    },
                ],
                components: [BuildingComponent.ROOF, BuildingComponent.CEILING],
                description: 'Roof leak causing ceiling damage.',
            },
            daysAgo(118),
        ),
        buildingObservation(
            'cmockbuildingcondition000000007',
            {
                condition: BuildingCondition.FAIR,
                issues: [
                    {
                        issue: BuildingIssue.CRACKING,
                        component: BuildingComponent.WALLS,
                    },
                ],
                components: [BuildingComponent.WALLS],
                description: 'Minor cracks in living room walls.',
            },
            daysAgo(61),
        ),
        buildingObservation(
            'cmockbuildingcondition000000008',
            {
                condition: BuildingCondition.GOOD,
                issues: [],
                components: [],
            },
            daysAgo(16),
        ),
    ],

    staleEvidence: [
        buildingObservation(
            'cmockbuildingcondition000000009',
            {
                condition: BuildingCondition.GOOD,
                issues: [],
                components: [],
            },
            daysAgo(605),
        ),
        buildingObservation(
            'cmockbuildingcondition000000010',
            {
                condition: BuildingCondition.GOOD,
                issues: [],
                components: [],
            },
            daysAgo(574),
        ),
    ],

    incompleteEvidence: [
        buildingObservation(
            'cmockbuildingcondition000000011',
            {
                condition: BuildingCondition.FAIR,
                issues: [],
                components: [],
            },
            daysAgo(11),
        ),
    ],

    mouldConcern: [
        buildingObservation(
            'cmockbuildingcondition000000012',
            {
                condition: BuildingCondition.POOR,
                issues: [
                    {
                        issue: BuildingIssue.MOULD,
                        component: BuildingComponent.WALLS,
                    },
                ],
                components: [BuildingComponent.WALLS],
                description:
                    'Visible mould on bedroom walls, damp smell present.',
            },
            daysAgo(8),
        ),
        buildingObservation(
            'cmockbuildingcondition000000013',
            {
                condition: BuildingCondition.FAIR,
                issues: [
                    {
                        issue: BuildingIssue.MOULD,
                        component: BuildingComponent.CEILING,
                    },
                ],
                components: [BuildingComponent.CEILING],
                description: 'Small patch of mould on bathroom ceiling.',
            },
            daysAgo(13),
        ),
    ],
};

export type BuildingConditionObservationScenarioName = keyof typeof scenarios;

export const buildingConditionObservationScenarios: Record<
    string,
    ObservationListResult
> = scenarios;