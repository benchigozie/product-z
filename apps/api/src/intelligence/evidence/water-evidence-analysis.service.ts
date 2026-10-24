import { Injectable } from '@nestjs/common';

import type { ObservationListResult } from '../../observation/types/observation-result.type.js';
import { EvidenceRecencyService } from './evidence-recency.service.js';
import { WaterAgreementService } from './water-agreement.service.js';
import { AvailabilityAgreementClassifier } from '../availability-agreement.classifier.js';
import { ObservationCategory } from '../../observation/enums/observation-category.enum.js';
import type { WaterData } from '../../observation/types/water/water-data.type.js';
import { Availability } from '../../observation/types/common/availability.type.js';
import { Reliability } from '../../observation/types/common/reliability.type.js';
import { WaterSource } from '../../observation/types/water/water-source.type.js';
import type { WaterCategoryAgreementAnalysis } from './types/category-agreement-analysis.type.js';
import type { EvidenceAnalysisResult } from './types/evidence-analysis-result.type.js';
import type { ObservationRecencyAnalysis } from './types/observation-recency-analysis.type.js';
import { EvidenceTemporalAnalysisService } from './evidence-temporal-analysis.service.js';
import type { TemporalAgreementAnalysis } from './types/temporal-agreement-analysis.type.js';

function isWaterData(value: unknown): value is WaterData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return (
        Array.isArray(data.source) &&
        data.source.length > 0 &&
        data.source.every((source) =>
            Object.values(WaterSource).includes(source as WaterSource),
        ) &&
        Object.values(Availability).includes(
            data.availability as Availability,
        ) &&
        (
            data.reliability === undefined ||
            Object.values(Reliability).includes(
                data.reliability as Reliability,
            )
        )
    );
}

@Injectable()
export class WaterEvidenceAnalysisService {
    constructor(
        private readonly evidenceRecencyService: EvidenceRecencyService,
        private readonly waterAgreementService: WaterAgreementService,
        private readonly availabilityAgreementClassifier: AvailabilityAgreementClassifier,
        private readonly evidenceTemporalAnalysisService: EvidenceTemporalAnalysisService,
    ) {}

    async analyze(
        observations: ObservationListResult,
    ): Promise<EvidenceAnalysisResult> {
        const waterObservations = observations.filter(
            (observation) =>
                observation.category === ObservationCategory.WATER,
        );

        const waterAgreementAnalyses: WaterCategoryAgreementAnalysis[] = [];
        const temporalAgreementAnalyses: TemporalAgreementAnalysis[] = [];

        for (let i = 0; i < waterObservations.length; i++) {
            for (let j = i + 1; j < waterObservations.length; j++) {
                const firstObservation = waterObservations[i];
                const secondObservation = waterObservations[j];

                if (
                    !isWaterData(firstObservation.data) ||
                    !isWaterData(secondObservation.data)
                ) {
                    console.warn(
                        'Skipping water agreement comparison: invalid observation data.',
                        firstObservation.id,
                        secondObservation.id,
                    );
                    continue;
                }

                const timeDifferenceInDays =
                    Math.abs(
                        firstObservation.observedAt.getTime() -
                        secondObservation.observedAt.getTime(),
                    ) / (1000 * 60 * 60 * 24);

                const agreementResult = this.waterAgreementService.compare(
                    firstObservation.data,
                    secondObservation.data,
                );

                const classification =
                    this.availabilityAgreementClassifier.classify(
                        agreementResult,
                    );

                waterAgreementAnalyses.push({
                    category: ObservationCategory.WATER,
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
            agreement: waterAgreementAnalyses,
            temporalAgreement: temporalAgreementAnalyses,
        };
    }
}