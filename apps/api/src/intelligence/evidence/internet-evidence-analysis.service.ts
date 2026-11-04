import { Injectable } from '@nestjs/common';

import type { ObservationListResult } from '../../observation/types/observation-result.type.js';
import { EvidenceRecencyService } from './evidence-recency.service.js';
import { InternetAgreementService } from './internet-agreement.service.js';
import { AvailabilityAgreementClassifier } from '../availability-agreement.classifier.js';
import { ObservationCategory } from '../../observation/enums/observation-category.enum.js';
import { Availability } from '../../observation/types/common/availability.type.js';
import { Reliability } from '../../observation/types/common/reliability.type.js';
import { Coverage } from '../../observation/types/internet/coverage.type.js';
import { InternetConnectionType } from '../../observation/types/internet/internet-connection-type.type.js';
import type { InternetData } from '../../observation/types/internet/internet-data.type.js';
import type { InternetCategoryAgreementAnalysis } from './types/category-agreement-analysis.type.js';
import type { EvidenceAnalysisResult } from './types/evidence-analysis-result.type.js';
import type { ObservationRecencyAnalysis } from './types/observation-recency-analysis.type.js';
import { EvidenceTemporalAnalysisService } from './evidence-temporal-analysis.service.js';
import type { TemporalAgreementAnalysis } from './types/temporal-agreement-analysis.type.js';

function isInternetData(value: unknown): value is InternetData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return (
        typeof data.provider === 'string' &&
        Object.values(InternetConnectionType).includes(
            data.connectionType as InternetConnectionType,
        ) &&
        Object.values(Availability).includes(
            data.availability as Availability,
        ) &&
        (data.reliability === undefined ||
            Object.values(Reliability).includes(
                data.reliability as Reliability,
            )) &&
        (data.coverage === undefined ||
            Object.values(Coverage).includes(data.coverage as Coverage))
    );
}

@Injectable()
export class InternetEvidenceAnalysisService {
    constructor(
        private readonly evidenceRecencyService: EvidenceRecencyService,
        private readonly internetAgreementService: InternetAgreementService,
        private readonly availabilityAgreementClassifier: AvailabilityAgreementClassifier,
        private readonly evidenceTemporalAnalysisService: EvidenceTemporalAnalysisService,
    ) {}

    async analyze(
        observations: ObservationListResult,
    ): Promise<EvidenceAnalysisResult> {
        const internetObservations = observations.filter(
            (observation) =>
                observation.category === ObservationCategory.INTERNET,
        );

        const internetAgreementAnalyses: InternetCategoryAgreementAnalysis[] =
            [];
        const temporalAgreementAnalyses: TemporalAgreementAnalysis[] = [];

        for (let i = 0; i < internetObservations.length; i++) {
            for (let j = i + 1; j < internetObservations.length; j++) {
                const firstObservation = internetObservations[i];
                const secondObservation = internetObservations[j];

                if (
                    !isInternetData(firstObservation.data) ||
                    !isInternetData(secondObservation.data)
                ) {
                    console.warn(
                        'Skipping internet agreement comparison: invalid observation data.',
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
                    this.internetAgreementService.compare(
                        firstObservation.data,
                        secondObservation.data,
                    );

                const classification =
                    this.availabilityAgreementClassifier.classify(
                        agreementResult,
                    );

                internetAgreementAnalyses.push({
                    category: ObservationCategory.INTERNET,
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
            agreement: internetAgreementAnalyses,
            temporalAgreement: temporalAgreementAnalyses,
        };
    }
}