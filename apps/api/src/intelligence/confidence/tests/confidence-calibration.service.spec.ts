import { describe, expect, it } from 'vitest';

import { ConclusionState } from '../../enums/conclusion-state.enum.js';
import { IntelligenceConfidence } from '../../enums/intelligence-confidence.enum.js';
import { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';
import { EvidenceRecencyClassification } from '../../evidence/evidence-recency.classification.js';
import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import { ConfidenceCalibrationService } from '../confidence-calibration.service.js';

import type { EvidenceAnalysisResult } from '../../evidence/types/evidence-analysis-result.type.js';

describe('ConfidenceCalibrationService', () => {
    const service = new ConfidenceCalibrationService();

    function makeAnalysis(opts: {
        recency: Array<{
            id: string;
            classification: EvidenceRecencyClassification;
        }>;
        agreement?: Array<{
            firstId: string;
            secondId: string;
            classification: EvidenceAgreementClassification;
        }>;
    }): EvidenceAnalysisResult {
        return {
            recency: opts.recency.map((r) => ({
                observationId: r.id,
                category: ObservationCategory.POWER,
                classification: r.classification,
            })),
            agreement: (opts.agreement ?? []).map((a) => ({
                category: ObservationCategory.POWER,
                firstObservationId: a.firstId,
                secondObservationId: a.secondId,
                classification: a.classification,
                timeDifferenceInDays: 5,
                agreement: {
                    availabilityDifference: 0,
                    reliabilityDifference: 0,
                },
            })),
            temporalAgreement: [],
        };
    }

    describe('rule 3 — no recent evidence', () => {
        it('returns LOW when all observations are OLD', () => {
            const analysis = makeAnalysis({
                recency: [
                    {
                        id: 'a',
                        classification: EvidenceRecencyClassification.OLD,
                    },
                ],
            });

            expect(
                service.calibrate(
                    ConclusionState.PRESENT,
                    IntelligenceConfidence.HIGH,
                    analysis,
                ),
            ).toBe(IntelligenceConfidence.LOW);
        });

        it('returns LOW when there are no observations at all', () => {
            const analysis = makeAnalysis({ recency: [] });

            expect(
                service.calibrate(
                    ConclusionState.PRESENT,
                    IntelligenceConfidence.MODERATE,
                    analysis,
                ),
            ).toBe(IntelligenceConfidence.LOW);
        });
    });

    describe('rule 1 — unresolved conclusion', () => {
        it('returns LOW when the conclusion is UNRESOLVED', () => {
            const analysis = makeAnalysis({
                recency: [
                    {
                        id: 'a',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                    {
                        id: 'b',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                    {
                        id: 'c',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                ],
            });

            expect(
                service.calibrate(
                    ConclusionState.UNRESOLVED,
                    IntelligenceConfidence.MODERATE,
                    analysis,
                ),
            ).toBe(IntelligenceConfidence.LOW);
        });
    });

    describe('rule 4 — recent contradiction', () => {
        it('returns LOW when recent observations contradict', () => {
            const analysis = makeAnalysis({
                recency: [
                    {
                        id: 'a',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                    {
                        id: 'b',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                ],
                agreement: [
                    {
                        firstId: 'a',
                        secondId: 'b',
                        classification:
                            EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
                    },
                ],
            });

            expect(
                service.calibrate(
                    ConclusionState.MIXED,
                    IntelligenceConfidence.MODERATE,
                    analysis,
                ),
            ).toBe(IntelligenceConfidence.LOW);
        });

        it('ignores contradictions involving non-recent observations', () => {
            const analysis = makeAnalysis({
                recency: [
                    {
                        id: 'a',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                    {
                        id: 'b',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                    {
                        id: 'c',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                    {
                        id: 'd',
                        classification: EvidenceRecencyClassification.OLD,
                    },
                ],
                agreement: [
                    {
                        firstId: 'a',
                        secondId: 'd',
                        classification:
                            EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
                    },
                ],
            });

            expect(
                service.calibrate(
                    ConclusionState.PRESENT,
                    IntelligenceConfidence.HIGH,
                    analysis,
                ),
            ).toBe(IntelligenceConfidence.HIGH);
        });
    });

    describe('rule 5 — three or more recent observations', () => {
        it('allows HIGH when 3+ recent observations agree', () => {
            const analysis = makeAnalysis({
                recency: [
                    {
                        id: 'a',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                    {
                        id: 'b',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                    {
                        id: 'c',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                ],
                agreement: [
                    {
                        firstId: 'a',
                        secondId: 'b',
                        classification:
                            EvidenceAgreementClassification.STRONG_AGREEMENT,
                    },
                    {
                        firstId: 'b',
                        secondId: 'c',
                        classification:
                            EvidenceAgreementClassification.STRONG_AGREEMENT,
                    },
                ],
            });

            expect(
                service.calibrate(
                    ConclusionState.PRESENT,
                    IntelligenceConfidence.HIGH,
                    analysis,
                ),
            ).toBe(IntelligenceConfidence.HIGH);
        });

        it('does not upgrade a conservative model proposal', () => {
            const analysis = makeAnalysis({
                recency: [
                    {
                        id: 'a',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                    {
                        id: 'b',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                    {
                        id: 'c',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                ],
            });

            expect(
                service.calibrate(
                    ConclusionState.PRESENT,
                    IntelligenceConfidence.MODERATE,
                    analysis,
                ),
            ).toBe(IntelligenceConfidence.MODERATE);
        });
    });

    describe('rule 2 — single recent observation', () => {
        it('caps HIGH at MODERATE with one recent observation', () => {
            const analysis = makeAnalysis({
                recency: [
                    {
                        id: 'a',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                ],
            });

            expect(
                service.calibrate(
                    ConclusionState.PRESENT,
                    IntelligenceConfidence.HIGH,
                    analysis,
                ),
            ).toBe(IntelligenceConfidence.MODERATE);
        });

        it('passes through MODERATE with one recent observation', () => {
            const analysis = makeAnalysis({
                recency: [
                    {
                        id: 'a',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                ],
            });

            expect(
                service.calibrate(
                    ConclusionState.PRESENT,
                    IntelligenceConfidence.MODERATE,
                    analysis,
                ),
            ).toBe(IntelligenceConfidence.MODERATE);
        });

        it('passes through LOW with one recent observation', () => {
            const analysis = makeAnalysis({
                recency: [
                    {
                        id: 'a',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                ],
            });

            expect(
                service.calibrate(
                    ConclusionState.PRESENT,
                    IntelligenceConfidence.LOW,
                    analysis,
                ),
            ).toBe(IntelligenceConfidence.LOW);
        });
    });

    describe('fallback — two recent observations', () => {
        it('caps HIGH at MODERATE with two recent observations', () => {
            const analysis = makeAnalysis({
                recency: [
                    {
                        id: 'a',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                    {
                        id: 'b',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                ],
                agreement: [
                    {
                        firstId: 'a',
                        secondId: 'b',
                        classification:
                            EvidenceAgreementClassification.STRONG_AGREEMENT,
                    },
                ],
            });

            expect(
                service.calibrate(
                    ConclusionState.PRESENT,
                    IntelligenceConfidence.HIGH,
                    analysis,
                ),
            ).toBe(IntelligenceConfidence.MODERATE);
        });
    });
});