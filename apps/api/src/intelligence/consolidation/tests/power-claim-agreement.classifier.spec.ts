import { describe, expect, it, beforeEach } from 'vitest';

import { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';
import { PowerClaimAgreementClassifier } from '../strategies/power-claim-agreement.classifier.js';
import type { PowerClaimAgreementResult } from '../types/power-claim-agreement.js';

describe('PowerClaimAgreementClassifier', () => {
    let classifier: PowerClaimAgreementClassifier;

    beforeEach(() => {
        classifier = new PowerClaimAgreementClassifier();
    });

    it('classifies identical claims as strong agreement', () => {
        const agreement: PowerClaimAgreementResult = {
            sourceMatch: true,
            availabilityDifference: 0,
        };

        expect(classifier.classify(agreement)).toBe(
            EvidenceAgreementClassification.STRONG_AGREEMENT,
        );
    });

    it('classifies a one-level availability difference as mixed agreement', () => {
        const agreement: PowerClaimAgreementResult = {
            sourceMatch: true,
            availabilityDifference: 1,
        };

        expect(classifier.classify(agreement)).toBe(
            EvidenceAgreementClassification.MIXED_AGREEMENT,
        );
    });

    it('classifies opposite availability states as contradictory evidence', () => {
        const agreement: PowerClaimAgreementResult = {
            sourceMatch: true,
            availabilityDifference: 2,
        };

        expect(classifier.classify(agreement)).toBe(
            EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
        );
    });

    it('classifies different source combinations as not comparable', () => {
        const agreement: PowerClaimAgreementResult = {
            sourceMatch: false,
            availabilityDifference: 2,
        };

        expect(classifier.classify(agreement)).toBe(
            EvidenceAgreementClassification.NOT_COMPARABLE,
        );
    });

    it('throws when availability difference is outside the expected range', () => {
        const agreement: PowerClaimAgreementResult = {
            sourceMatch: true,
            availabilityDifference: 3,
        };

        expect(() => classifier.classify(agreement)).toThrow(
            'Unexpected availability difference: 3',
        );
    });
});