
import { Injectable } from '@nestjs/common';

import type { ObservationListResult } from '../../observation/types/observation-result.type.js';
import type { EvidenceAnalysisResult } from './types/evidence-analysis-result.type.js';
import type { EvidenceWeightAssessment } from './types/evidence-weight-assessment.type.js';

import { EvidenceAgreementClassification } from './evidence-agreement.classification.js';

@Injectable()
export class EvidenceWeightingService {
    analyze(
        observations: ObservationListResult,
        analysis: EvidenceAnalysisResult,
    ): EvidenceWeightAssessment[] {
        const assessments: EvidenceWeightAssessment[] =
            observations.map((observation) => {
                const recency = analysis.recency.find(
                    (result) =>
                        result.observationId === observation.id,
                );

                if (!recency) {
                    throw new Error(
                        `Missing recency analysis for observation ${observation.id}`,
                    );
                }

                const supportingObservationIds: string[] = [];
                const conflictingObservationIds: string[] = [];
                const pairAssessments = analysis.temporalAgreement
                .filter(
                    (result) =>
                        result.firstObservationId === observation.id ||
                        result.secondObservationId === observation.id,
                )
                .map((result) => ({
                    otherObservationId:
                        result.firstObservationId === observation.id
                            ? result.secondObservationId
                            : result.firstObservationId,
                    temporalInterpretation: result.interpretation,
                }));

                for (const agreement of analysis.agreement) {
                    const isFirst =
                        agreement.firstObservationId === observation.id;
                    const isSecond =
                        agreement.secondObservationId === observation.id;

                    if (!isFirst && !isSecond) {
                        continue;
                    }

                    const otherObservationId = isFirst
                        ? agreement.secondObservationId
                        : agreement.firstObservationId;

                    if (
                        agreement.classification ===
                        EvidenceAgreementClassification.STRONG_AGREEMENT
                    ) {
                        supportingObservationIds.push(otherObservationId);
                    } else if (
                        agreement.classification ===
                        EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE
                    ) {
                        conflictingObservationIds.push(otherObservationId);
                    }
                }

                return {
                    observationId: observation.id,
                    recency: recency.classification,
                    supportingObservationIds,
                    conflictingObservationIds,
                    pairAssessments,
                };
            });

        return assessments;
    }
}
