import { describe, expect, it } from 'vitest';

import { EvidenceAgreementClassification } from '../evidence-agreement.classification.js';
import { EvidenceTemporalAnalysisService } from '../evidence-temporal-analysis.service.js';
import {
    TemporalAgreementInterpretation,
} from '../types/temporal-agreement-analysis.type.js';

describe('EvidenceTemporalAnalysisService', () => {
    const service = new EvidenceTemporalAnalysisService();

    it('interprets strong agreement as consistent', () => {
        const result = service.analyze(
            'power-1',
            'power-2',
            EvidenceAgreementClassification.STRONG_AGREEMENT,
            5,
        );

        expect(result).toEqual({
            firstObservationId: 'power-1',
            secondObservationId: 'power-2',
            agreementClassification:
                EvidenceAgreementClassification.STRONG_AGREEMENT,
            interpretation:
                TemporalAgreementInterpretation.CONSISTENT,
            timeDifferenceInDays: 5,
        });
    });

    it('keeps disagreement unresolved when the time gap is below the threshold', () => {
        const result = service.analyze(
            'power-1',
            'power-2',
            EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
            29,
        );

        expect(result.interpretation).toBe(
            TemporalAgreementInterpretation.UNRESOLVED_DISAGREEMENT,
        );
    });

    it('interprets disagreement at the threshold as a possible change', () => {
        const result = service.analyze(
            'power-1',
            'power-2',
            EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
            30,
        );

        expect(result.interpretation).toBe(
            TemporalAgreementInterpretation.POSSIBLE_CHANGE,
        );
    });

    it('interprets disagreement beyond the threshold as a possible change', () => {
        const result = service.analyze(
            'power-1',
            'power-2',
            EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE,
            60,
        );

        expect(result.interpretation).toBe(
            TemporalAgreementInterpretation.POSSIBLE_CHANGE,
        );
    });

    it('keeps mixed agreement unresolved even when observations are far apart', () => {
        const result = service.analyze(
            'power-1',
            'power-2',
            EvidenceAgreementClassification.MIXED_AGREEMENT,
            60,
        );
    
        expect(result.interpretation).toBe(
            TemporalAgreementInterpretation.UNRESOLVED_DISAGREEMENT,
        );
    });
});