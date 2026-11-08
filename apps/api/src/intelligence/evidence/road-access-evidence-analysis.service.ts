import { Injectable } from '@nestjs/common';

import type { ObservationListResult } from '../../observation/types/observation-result.type.js';
import { EvidenceRecencyService } from './evidence-recency.service.js';
import { RoadAccessAgreementService } from './road-access-agreement.service.js';
import { RoadAccessAgreementClassifier } from './road-access-agreement.classifier.js';
import { ObservationCategory } from '../../observation/enums/observation-category.enum.js';
import { RoadAccessibility } from '../../observation/types/road/road-accessibility.type.js';
import { RoadCondition } from '../../observation/types/road/road-condition.type.js';
import type { RoadAccessData } from '../../observation/types/road/road-access-data.type.js';
import type { RoadAccessCategoryAgreementAnalysis } from './types/category-agreement-analysis.type.js';
import type { EvidenceAnalysisResult } from './types/evidence-analysis-result.type.js';
import type { ObservationRecencyAnalysis } from './types/observation-recency-analysis.type.js';
import { EvidenceTemporalAnalysisService } from './evidence-temporal-analysis.service.js';
import type { TemporalAgreementAnalysis } from './types/temporal-agreement-analysis.type.js';

function isRoadAccessData(value: unknown): value is RoadAccessData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return (
        Object.values(RoadCondition).includes(
            data.condition as RoadCondition,
        ) &&
        Array.isArray(data.accessibility) &&
        data.accessibility.length > 0 &&
        data.accessibility.every((v) =>
            Object.values(RoadAccessibility).includes(
                v as RoadAccessibility,
            ),
        )
    );
}

@Injectable()
export class RoadAccessEvidenceAnalysisService {
    constructor(
        private readonly evidenceRecencyService: EvidenceRecencyService,
        private readonly roadAccessAgreementService: RoadAccessAgreementService,
        private readonly roadAccessAgreementClassifier: RoadAccessAgreementClassifier,
        private readonly evidenceTemporalAnalysisService: EvidenceTemporalAnalysisService,
    ) {}

    async analyze(
        observations: ObservationListResult,
    ): Promise<EvidenceAnalysisResult> {
        const roadObservations = observations.filter(
            (observation) =>
                observation.category === ObservationCategory.ROAD_ACCESS,
        );

        const roadAgreementAnalyses: RoadAccessCategoryAgreementAnalysis[] =
            [];
        const temporalAgreementAnalyses: TemporalAgreementAnalysis[] = [];

        for (let i = 0; i < roadObservations.length; i++) {
            for (let j = i + 1; j < roadObservations.length; j++) {
                const firstObservation = roadObservations[i];
                const secondObservation = roadObservations[j];

                if (
                    !isRoadAccessData(firstObservation.data) ||
                    !isRoadAccessData(secondObservation.data)
                ) {
                    console.warn(
                        'Skipping road access agreement comparison: invalid observation data.',
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
                    this.roadAccessAgreementService.compare(
                        firstObservation.data,
                        secondObservation.data,
                    );

                const classification =
                    this.roadAccessAgreementClassifier.classify(
                        agreementResult,
                    );

                roadAgreementAnalyses.push({
                    category: ObservationCategory.ROAD_ACCESS,
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
            agreement: roadAgreementAnalyses,
            temporalAgreement: temporalAgreementAnalyses,
        };
    }
}