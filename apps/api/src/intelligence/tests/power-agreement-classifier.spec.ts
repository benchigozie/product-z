import { describe, expect, it } from 'vitest';

import { EvidenceAgreementClassification } from '../evidence/evidence-agreement.classification.js';
import { PowerAgreementClassifier } from '../power-agreement-classifier.js';

import type { PowerAgreementResult } from '../evidence/power-agreement.js';

describe('PowerAgreementClassifier', () => {
    const classifier = new PowerAgreementClassifier();

    it('classifies identical availability as strong agreement when reliability is absent', () => {
        const result: PowerAgreementResult = {
            availabilityDifference: 0,
            reliabilityDifference: null,
        };

        expect(classifier.classify(result)).toBe(
            EvidenceAgreementClassification.STRONG_AGREEMENT,
        );
    });

    it('classifies a complete availability difference as contradictory evidence', () => {
        const result: PowerAgreementResult = {
            availabilityDifference: 2,
            reliabilityDifference: null,
        };

        expect(classifier.classify(result)).toBe(
            EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
        );
    });

    it('classifies a small reliability difference with identical availability as strong agreement', () => {
        const result: PowerAgreementResult = {
            availabilityDifference: 0,
            reliabilityDifference: 1,
        };

        expect(classifier.classify(result)).toBe(
            EvidenceAgreementClassification.STRONG_AGREEMENT,
        );
    });

    it('classifies a moderate difference as mixed agreement', () => {
        const result: PowerAgreementResult = {
            availabilityDifference: 1,
            reliabilityDifference: 1,
        };

        expect(classifier.classify(result)).toBe(
            EvidenceAgreementClassification.MIXED_AGREEMENT,
        );
    });

    it('classifies a large reliability difference as contradictory evidence', () => {
        const result: PowerAgreementResult = {
            availabilityDifference: 0,
            reliabilityDifference: 3,
        };

        expect(classifier.classify(result)).toBe(
            EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
        );
    });
});