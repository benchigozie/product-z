import { describe, expect, it } from 'vitest';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';

import { EvidenceAgreementClassification } from '../evidence-agreement.classification.js';
import { EvidenceRecencyClassification } from '../evidence-recency.classification.js';
import { EvidenceWeightingService } from '../evidence-weighting.service.js';
import { TemporalAgreementInterpretation } from '../types/temporal-agreement-analysis.type.js';
import type { EvidenceAnalysisResult } from '../types/evidence-analysis-result.type.js';

describe('EvidenceWeightingService', () => {
    const service = new EvidenceWeightingService();

    const observations = [
        {
            id: 'power-1',
            category: ObservationCategory.POWER,
        },
        {
            id: 'power-2',
            category: ObservationCategory.POWER,
        },
    ] as unknown as ObservationListResult;

    function createAnalysis(
        classification: EvidenceAgreementClassification,
    ): EvidenceAnalysisResult {
        return {
            recency: observations.map((observation) => ({
                observationId: observation.id,
                category: observation.category,
                classification: EvidenceRecencyClassification.RECENT,
            })),
            agreement: [
                {
                    category: ObservationCategory.POWER,
                    firstObservationId: 'power-1',
                    secondObservationId: 'power-2',
                    classification,
                    timeDifferenceInDays: 10,
                    agreement: {
                        availabilityDifference: 0,
                        reliabilityDifference: 0,
                    },
                },
            ],
            temporalAgreement: [
                {
                    firstObservationId: 'power-1',
                    secondObservationId: 'power-2',
                    agreementClassification: classification,
                    interpretation:
                        classification === EvidenceAgreementClassification.STRONG_AGREEMENT
                            ? TemporalAgreementInterpretation.CONSISTENT
                            : TemporalAgreementInterpretation.UNRESOLVED_DISAGREEMENT,
                    timeDifferenceInDays: 10,
                },
            ],
        };
    }

    it('records strong agreement as supporting evidence', () => {
        const result = service.analyze(
            observations,
            createAnalysis(EvidenceAgreementClassification.STRONG_AGREEMENT),
        );

        expect(result[0].supportingObservationIds).toEqual(['power-2']);
        expect(result[0].conflictingObservationIds).toEqual([]);
        expect(result[1].supportingObservationIds).toEqual(['power-1']);
    });

    it('records contradictory evidence as conflicting evidence', () => {
        const result = service.analyze(
            observations,
            createAnalysis(EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE),
        );

        expect(result[0].conflictingObservationIds).toEqual(['power-2']);
        expect(result[0].supportingObservationIds).toEqual([]);
        expect(result[1].conflictingObservationIds).toEqual(['power-1']);
    });

    it('does not force mixed agreement into support or conflict', () => {
        const result = service.analyze(
            observations,
            createAnalysis(EvidenceAgreementClassification.MIXED_AGREEMENT),
        );

        expect(result[0].supportingObservationIds).toEqual([]);
        expect(result[0].conflictingObservationIds).toEqual([]);
    });


    it('preserves possible change as temporal context for a conflicting pair', () => {
        const analysis = createAnalysis(
            EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
        );

        analysis.temporalAgreement[0] = {
            ...analysis.temporalAgreement[0],
            interpretation: TemporalAgreementInterpretation.POSSIBLE_CHANGE,
            timeDifferenceInDays: 45,
        };

        const result = service.analyze(observations, analysis);

        expect(result[0].conflictingObservationIds).toEqual(['power-2']);
        expect(result[0].pairAssessments).toEqual([
            {
                otherObservationId: 'power-2',
                temporalInterpretation:
                    TemporalAgreementInterpretation.POSSIBLE_CHANGE,
            },
        ]);
    });

});