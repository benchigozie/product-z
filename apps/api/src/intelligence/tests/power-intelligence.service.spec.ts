
import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IntelligenceConfidence } from '../enums/intelligence-confidence.enum.js';
import { IntelligenceConclusionValidationService } from '../intelligence-conclusion-validation.service.js';
import { PowerIntelligenceService } from '../power-intelligence.service.js';

import type { PowerIntelligenceInput } from '../types/power-intelligence-input.type.js';
import type { IntelligenceConclusion } from '../types/intelligence-conclusion.type.js';
import type { IntelligenceInterpreter } from '../types/intelligence-interpreter.type.js';

describe('PowerIntelligenceService', () => {
    const observationId = 'a7f6c4b1-2d83-4e91-8b52-6c1d9e3f5a70';

    const input = {
        observations: [{ id: observationId }],
        evidenceAnalysis: {
            recency: [],
            powerAgreement: [],
            temporalAgreement: [],
        },
        evidenceAssessments: [],
    } as unknown as PowerIntelligenceInput;

    const conclusion: IntelligenceConclusion = {
        conclusion: 'Electricity supply appears intermittent.',
        confidence: IntelligenceConfidence.MODERATE,
        reason: 'Recent observations report inconsistent availability.',
        reasonSignals: ['RECENT_EVIDENCE'],
        evidenceReferences: [observationId],
        considerations: ['Verify current supply conditions.'],
    };

    const interpreter = {
        interpret: vi.fn(),
    } as unknown as IntelligenceInterpreter<PowerIntelligenceInput>;

    const conclusionValidation = {
        validate: vi.fn(),
    } as unknown as IntelligenceConclusionValidationService;

    let service: PowerIntelligenceService;

    beforeEach(() => {
        vi.clearAllMocks();

        service = new PowerIntelligenceService(
            interpreter,
            conclusionValidation,
        );
    });

    it('returns the validated interpreter result', async () => {
        vi.mocked(interpreter.interpret).mockResolvedValue(conclusion);
        vi.mocked(conclusionValidation.validate).mockResolvedValue(conclusion);

        await expect(service.interpret(input)).resolves.toEqual(conclusion);

        expect(interpreter.interpret).toHaveBeenCalledWith(input);
        expect(conclusionValidation.validate).toHaveBeenCalledWith(
            conclusion,
            new Set([observationId]),
        );
    });

    it('rejects the result when validation fails', async () => {
        vi.mocked(interpreter.interpret).mockResolvedValue(conclusion);
        vi.mocked(conclusionValidation.validate).mockRejectedValue(
            new BadRequestException('Invalid conclusion'),
        );

        await expect(service.interpret(input)).rejects.toThrow(
            BadRequestException,
        );
    });

    it('does not validate when the interpreter fails', async () => {
        vi.mocked(interpreter.interpret).mockRejectedValue(
            new Error('Interpreter failed'),
        );

        await expect(service.interpret(input)).rejects.toThrow(
            'Interpreter failed',
        );

        expect(conclusionValidation.validate).not.toHaveBeenCalled();
    });
});
