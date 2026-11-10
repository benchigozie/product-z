import { Injectable } from '@nestjs/common';

import type { ObservationListResult } from '../../observation/types/observation-result.type.js';
import { EvidenceRecencyService } from './evidence-recency.service.js';
import { BuildingConditionAgreementService } from './building-condition-agreement.service.js';
import { BuildingConditionAgreementClassifier } from './building-condition-agreement.classifier.js';
import { ObservationCategory } from '../../observation/enums/observation-category.enum.js';
import { BuildingCondition } from '../../observation/types/building-condition/building-condition.type.js';
import { BuildingComponent } from '../../observation/types/building-condition/building-component.type.js';
import { BuildingIssue } from '../../observation/types/building-condition/building-issue.type.js';
import type { BuildingConditionData } from '../../observation/types/building-condition/building-condition-data.type.js';
import type { BuildingConditionCategoryAgreementAnalysis } from './types/category-agreement-analysis.type.js';
import type { EvidenceAnalysisResult } from './types/evidence-analysis-result.type.js';
import type { ObservationRecencyAnalysis } from './types/observation-recency-analysis.type.js';
import { EvidenceTemporalAnalysisService } from './evidence-temporal-analysis.service.js';
import type { TemporalAgreementAnalysis } from './types/temporal-agreement-analysis.type.js';

function isBuildingConditionData(
    value: unknown,
): value is BuildingConditionData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return (
        Object.values(BuildingCondition).includes(
            data.condition as BuildingCondition,
        ) &&
        Array.isArray(data.issues) &&
        data.issues.every((entry) => {
            if (
                typeof entry !== 'object' ||
                entry === null ||
                Array.isArray(entry)
            ) {
                return false;
            }
            const e = entry as Record<string, unknown>;
            return (
                Object.values(BuildingIssue).includes(
                    e.issue as BuildingIssue,
                ) &&
                (e.component === undefined ||
                    Object.values(BuildingComponent).includes(
                        e.component as BuildingComponent,
                    ))
            );
        }) &&
        Array.isArray(data.components) &&
        data.components.every((c) =>
            Object.values(BuildingComponent).includes(
                c as BuildingComponent,
            ),
        )
    );
}

@Injectable()
export class BuildingConditionEvidenceAnalysisService {
    constructor(
        private readonly evidenceRecencyService: EvidenceRecencyService,
        private readonly buildingConditionAgreementService: BuildingConditionAgreementService,
        private readonly buildingConditionAgreementClassifier: BuildingConditionAgreementClassifier,
        private readonly evidenceTemporalAnalysisService: EvidenceTemporalAnalysisService,
    ) {}

    async analyze(
        observations: ObservationListResult,
    ): Promise<EvidenceAnalysisResult> {
        const buildingObservations = observations.filter(
            (observation) =>
                observation.category ===
                ObservationCategory.BUILDING_CONDITION,
        );

        const buildingAgreementAnalyses: BuildingConditionCategoryAgreementAnalysis[] =
            [];
        const temporalAgreementAnalyses: TemporalAgreementAnalysis[] = [];

        for (let i = 0; i < buildingObservations.length; i++) {
            for (let j = i + 1; j < buildingObservations.length; j++) {
                const firstObservation = buildingObservations[i];
                const secondObservation = buildingObservations[j];

                if (
                    !isBuildingConditionData(firstObservation.data) ||
                    !isBuildingConditionData(secondObservation.data)
                ) {
                    console.warn(
                        'Skipping building condition agreement comparison: invalid observation data.',
                        firstObservation.id,
                        secondObservation.id,
                    );
                    continue;
                }

                const timeDifferenceInDays =
                    Math.abs(
                        firstObservation.observedAt.getTime() -
                            secondObservation.observedAt.getTime(),
                    ) /
                    (1000 * 60 * 60 * 24);

                const agreementResult =
                    this.buildingConditionAgreementService.compare(
                        firstObservation.data,
                        secondObservation.data,
                    );

                const classification =
                    this.buildingConditionAgreementClassifier.classify(
                        agreementResult,
                    );

                buildingAgreementAnalyses.push({
                    category: ObservationCategory.BUILDING_CONDITION,
                    firstObservationId: firstObservation.id,
                    secondObservationId: secondObservation.id,
                    classification,
                    timeDifferenceInDays,
                    agreement: agreementResult,
                });

                temporalAgreementAnalyses.push(
                    this.evidenceTemporalAnalysisService.analyze(
                        firstObservation.id,
                        secondObservation.id,
                        classification,
                        timeDifferenceInDays,
                    ),
                );
            }
        }

        const recencyAnalyses: ObservationRecencyAnalysis[] = [];

        for (const observation of observations) {
            const classification =
                this.evidenceRecencyService.classify(observation);

            recencyAnalyses.push({
                observationId: observation.id,
                category: observation.category,
                classification,
            });
        }

        return {
            recency: recencyAnalyses,
            agreement: buildingAgreementAnalyses,
            temporalAgreement: temporalAgreementAnalyses,
        };
    }
}