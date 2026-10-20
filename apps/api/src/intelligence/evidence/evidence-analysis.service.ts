import { Injectable } from '@nestjs/common';

import type { ObservationListResult } from '../../observation/types/observation-result.type.js';
import { EvidenceRecencyService } from './evidence-recency.service.js';

import { PowerAgreementService } from '../power-agreement.service.js';
import { AvailabilityAgreementClassifier } from '../availability-agreement.classifier.js';
import { ObservationCategory } from '../../observation/enums/observation-category.enum.js';
import type { PowerData } from '../../observation/types/power/power-data.type.js';
import { Availability } from '../../observation/types/common/availability.type.js';
import { Reliability } from '../../observation/types/common/reliability.type.js';
import { PowerSource } from '../../observation/types/power/power-data.type.js';
import type { PowerAgreementAnalysis } from './types/power-agreement-analysis.type.js';
import type { EvidenceAnalysisResult } from './types/evidence-analysis-result.type.js';
import type { ObservationRecencyAnalysis } from './types/observation-recency-analysis.type.js';
import { EvidenceTemporalAnalysisService } from './evidence-temporal-analysis.service.js';
import type { TemporalAgreementAnalysis } from './types/temporal-agreement-analysis.type.js';
function isPowerData(value: unknown): value is PowerData {
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
            Object.values(PowerSource).includes(
                source as PowerSource,
            ),
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
export class EvidenceAnalysisService {
    constructor(
        private readonly evidenceRecencyService: EvidenceRecencyService,
        private readonly powerAgreementService: PowerAgreementService,
        private readonly AvailabilityAgreementClassifier: AvailabilityAgreementClassifier,
        private readonly evidenceTemporalAnalysisService: EvidenceTemporalAnalysisService,
    ) { }

    
async analyze(
    observations: ObservationListResult,
): Promise<EvidenceAnalysisResult> {
    const powerObservations = observations.filter(
        (observation) =>
            observation.category === ObservationCategory.POWER,
    );

    const powerAgreementAnalyses: PowerAgreementAnalysis[] = [];
    const temporalAgreementAnalyses: TemporalAgreementAnalysis[] = [];

    for (let i = 0; i < powerObservations.length; i++) {
        for (let j = i + 1; j < powerObservations.length; j++) {
            const firstObservation = powerObservations[i];
            const secondObservation = powerObservations[j];

           
            if (
                !isPowerData(firstObservation.data) ||
                !isPowerData(secondObservation.data)
            ) {
                console.warn(
                    'Skipping power agreement comparison: invalid observation data.',
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


            const agreementResult = this.powerAgreementService.compare(
                firstObservation.data,
                secondObservation.data,
            );

            const classification =
                this.AvailabilityAgreementClassifier.classify(agreementResult);

            powerAgreementAnalyses.push({
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
        powerAgreement: powerAgreementAnalyses,
        temporalAgreement: temporalAgreementAnalyses,
    };
}

}