import { describe, expect, it } from 'vitest';

import { EvidenceAgreementClassification } from '../evidence/evidence-agreement.classification.js';
import { AvailabilityAgreementClassifier } from '../availability-agreement.classifier.js';
import type { AgreementResult } from '../evidence/agreement-result.type.js';


describe('PowerAgreementClassifier', () => {
    const classifier = new AvailabilityAgreementClassifier();

    const classify = (
        availabilityDifference: number,
        reliabilityDifference: number | null,
    ) =>
        classifier.classify({
            availabilityDifference,
            reliabilityDifference,
        } satisfies AgreementResult);

    describe('condition agreement is determined by availability alone', () => {
        it('classifies identical availability as STRONG_AGREEMENT', () => {
            expect(classify(0, null)).toBe(
                EvidenceAgreementClassification.STRONG_AGREEMENT,
            );
            expect(classify(0, 0)).toBe(
                EvidenceAgreementClassification.STRONG_AGREEMENT,
            );
        });

        it('classifies adjacent availability as MIXED_AGREEMENT', () => {
            expect(classify(1, null)).toBe(
                EvidenceAgreementClassification.MIXED_AGREEMENT,
            );
            expect(classify(1, 0)).toBe(
                EvidenceAgreementClassification.MIXED_AGREEMENT,
            );
        });

        it('classifies opposite availability as CONTRADICTORY_EVIDENCE', () => {
            expect(classify(2, null)).toBe(
                EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
            );
            expect(classify(2, 0)).toBe(
                EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
            );
        });
    });

    describe('reliability must not affect condition classification', () => {
        it('keeps identical availability as STRONG_AGREEMENT even when reliability differs substantially', () => {
            // EXCELLENT vs VERY_POOR → reliabilityDifference = 4
            expect(classify(0, 4)).toBe(
                EvidenceAgreementClassification.STRONG_AGREEMENT,
            );

            // GOOD vs VERY_POOR → reliabilityDifference = 3
            expect(classify(0, 3)).toBe(
                EvidenceAgreementClassification.STRONG_AGREEMENT,
            );

            // This was the previous bug: reliability diff >= 3 alone
            // used to force CONTRADICTORY_EVIDENCE.
            expect(classify(0, 3)).not.toBe(
                EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
            );
        });

        it('keeps adjacent availability as MIXED_AGREEMENT regardless of reliability', () => {
            expect(classify(1, 3)).toBe(
                EvidenceAgreementClassification.MIXED_AGREEMENT,
            );
            expect(classify(1, 4)).toBe(
                EvidenceAgreementClassification.MIXED_AGREEMENT,
            );
        });

        it('keeps opposite availability as CONTRADICTORY_EVIDENCE regardless of reliability', () => {
            expect(classify(2, 3)).toBe(
                EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
            );
            expect(classify(2, 4)).toBe(
                EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
            );
        });
    });
});