
import { BadRequestException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import { IntelligenceConfidence } from '../enums/intelligence-confidence.enum.js';
import { IntelligenceConclusionValidationService } from '../intelligence-conclusion-validation.service.js';

describe('IntelligenceConclusionValidationService', () => {
    const service = new IntelligenceConclusionValidationService();

    const observationId = 'a7f6c4b1-2d83-4e91-8b52-6c1d9e3f5a70';
    const validObservationIds = new Set([observationId]);

    const validConclusion = {
        conclusion: 'Electricity supply appears intermittent.',
        confidence: IntelligenceConfidence.MODERATE,
        reason: 'Recent observations report inconsistent availability.',
        reasonSignals: ['RECENT_EVIDENCE', 'MIXED_AGREEMENT'],
        evidenceReferences: [observationId],
        considerations: ['Verify current supply conditions.'],
    };

    it('accepts a valid conclusion with known observation references', async () => {
        await expect(
            service.validate(validConclusion, validObservationIds),
        ).resolves.toEqual(validConclusion);
    });

    it('rejects an invalid confidence value', async () => {
        await expect(
            service.validate(
                { ...validConclusion, confidence: 'CERTAIN' },
                validObservationIds,
            ),
        ).rejects.toThrow(BadRequestException);
    });

    it('rejects references to unknown observations', async () => {
        await expect(
            service.validate(
                {
                    ...validConclusion,
                    evidenceReferences: [
                        'd9e8f7a6-5b43-4210-9c87-6d5e4f3a2b10',
                    ],
                },
                validObservationIds,
            ),
        ).rejects.toThrow(BadRequestException);
    });

    it('rejects unexpected properties', async () => {
        await expect(
            service.validate(
                { ...validConclusion, unsupportedField: true },
                validObservationIds,
            ),
        ).rejects.toThrow(BadRequestException);
    });
});
