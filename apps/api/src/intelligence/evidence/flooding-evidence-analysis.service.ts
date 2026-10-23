// TODO: Generalize this into a strategy-based EvidenceAnalysisService
// once we've shipped WATER and FLOODING and can see the actual common shape.
// Right now power, water, and flooding duplicate the recency and temporal loops.

import { Injectable } from '@nestjs/common';

import type { ObservationListResult } from '../../observation/types/observation-result.type.js';
import { EvidenceRecencyService } from './evidence-recency.service.js';
import { FloodingAgreementService } from './flooding-agreement.service.js';
import { FloodingAgreementClassifier } from './flooding-agreement.classifier.js';
import { ObservationCategory } from '../../observation/enums/observation-category.enum.js';
import { FloodingOccurrence } from '../../observation/types/flooding/flooding-occurrence.type.js';
import { FloodingExtent } from '../../observation/types/flooding/flooding-extent.type.js';
import { Severity } from '../../observation/types/common/severity.type.js';
import type { FloodingData } from '../../observation/types/flooding/flooding-data.type.js';
import type { FloodingAgreementAnalysis } from './types/flooding-agreement-analysis.type.js';
import type { EvidenceAnalysisResult } from './types/evidence-analysis-result.type.js';
import type { ObservationRecencyAnalysis } from './types/observation-recency-analysis.type.js';
import { EvidenceTemporalAnalysisService } from './evidence-temporal-analysis.service.js';
import type { TemporalAgreementAnalysis } from './types/temporal-agreement-analysis.type.js';

function isFloodingData(value: unknown): value is FloodingData {
    if (
        typeof value !== 'object' ||
        value === null ||
        Array.isArray(value)
    ) {
        return false;
    }

    const data = value as Record<string, unknown>;

    return (
        Object.values(FloodingOccurrence).includes(
            data.occurrence as FloodingOccurrence,
        ) &&
        Object.values(FloodingExtent).includes(
            data.extent as FloodingExtent,
        ) &&
        (
            data.severity === undefined ||
            Object.values(Severity).includes(
                data.severity as Severity,
            )
        )
    );
}

@Injectable()
export class FloodingEvidenceAnalysisService {
    constructor(
        private readonly evidenceRecencyService: EvidenceRecencyService,
        private readonly floodingAgreementService: FloodingAgreementService,
        private readonly floodingAgreementClassifier: FloodingAgreementClassifier,
        private readonly evidenceTemporalAnalysisService: EvidenceTemporalAnalysisService,
    ) {}

    async analyze(
        observations: ObservationListResult,
    ): Promise<EvidenceAnalysisResult> {
        const floodingObservations = observations.filter(
            (observation) =>
                observation.category === ObservationCategory.FLOODING,
        );

        const floodingAgreementAnalyses: FloodingAgreementAnalysis[] = [];
        const temporalAgreementAnalyses: TemporalAgreementAnalysis[] = [];

        for (let i = 0; i < floodingObservations.length; i++) {
            for (let j = i + 1; j < floodingObservations.length; j++) {
                const firstObservation = floodingObservations[i];
                const secondObservation = floodingObservations[j];

                if (
                    !isFloodingData(firstObservation.data) ||
                    !isFloodingData(secondObservation.data)
                ) {
                    console.warn(
                        'Skipping flooding agreement comparison: invalid observation data.',
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

                const agreementResult = this.floodingAgreementService.compare(
                    firstObservation.data,
                    secondObservation.data,
                );

                const classification =
                    this.floodingAgreementClassifier.classify(
                        agreementResult,
                    );

                floodingAgreementAnalyses.push({
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
            powerAgreement: floodingAgreementAnalyses as unknown as EvidenceAnalysisResult['powerAgreement'],
            temporalAgreement: temporalAgreementAnalyses,
        };
    }
}