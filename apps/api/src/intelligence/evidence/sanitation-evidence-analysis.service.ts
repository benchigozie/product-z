import { Injectable } from '@nestjs/common';

import type { ObservationListResult } from '../../observation/types/observation-result.type.js';
import { EvidenceRecencyService } from './evidence-recency.service.js';
import { SanitationAgreementService } from './sanitation-agreement.service.js';
import { SanitationAgreementClassifier } from './sanitation-agreement.classifier.js';
import { ObservationCategory } from '../../observation/enums/observation-category.enum.js';
import { SanitationCondition } from '../../observation/types/sanitation/sanitation-condition.type.js';
import type { SanitationData } from '../../observation/types/sanitation/sanitation-data.type.js';
import type { SanitationCategoryAgreementAnalysis } from './types/category-agreement-analysis.type.js';
import type { EvidenceAnalysisResult } from './types/evidence-analysis-result.type.js';
import type { ObservationRecencyAnalysis } from './types/observation-recency-analysis.type.js';
import { EvidenceTemporalAnalysisService } from './evidence-temporal-analysis.service.js';
import type { TemporalAgreementAnalysis } from './types/temporal-agreement-analysis.type.js';

function isSanitationData(value: unknown): value is SanitationData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return Object.values(SanitationCondition).includes(
        data.condition as SanitationCondition,
    );
}

@Injectable()
export class SanitationEvidenceAnalysisService {
    constructor(
        private readonly evidenceRecencyService: EvidenceRecencyService,
        private readonly sanitationAgreementService: SanitationAgreementService,
        private readonly sanitationAgreementClassifier: SanitationAgreementClassifier,
        private readonly evidenceTemporalAnalysisService: EvidenceTemporalAnalysisService,
    ) {}

    async analyze(
        observations: ObservationListResult,
    ): Promise<EvidenceAnalysisResult> {
        const sanitationObservations = observations.filter(
            (observation) =>
                observation.category === ObservationCategory.SANITATION,
        );

        const sanitationAgreementAnalyses: SanitationCategoryAgreementAnalysis[] =
            [];
        const temporalAgreementAnalyses: TemporalAgreementAnalysis[] = [];

        for (let i = 0; i < sanitationObservations.length; i++) {
            for (let j = i + 1; j < sanitationObservations.length; j++) {
                const firstObservation = sanitationObservations[i];
                const secondObservation = sanitationObservations[j];

                if (
                    !isSanitationData(firstObservation.data) ||
                    !isSanitationData(secondObservation.data)
                ) {
                    console.warn(
                        'Skipping sanitation agreement comparison: invalid observation data.',
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
                    this.sanitationAgreementService.compare(
                        firstObservation.data,
                        secondObservation.data,
                    );

                const classification =
                    this.sanitationAgreementClassifier.classify(
                        agreementResult,
                    );

                sanitationAgreementAnalyses.push({
                    category: ObservationCategory.SANITATION,
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
            agreement: sanitationAgreementAnalyses,
            temporalAgreement: temporalAgreementAnalyses,
        };
    }
}