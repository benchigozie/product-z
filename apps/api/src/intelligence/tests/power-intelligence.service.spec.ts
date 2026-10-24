import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IntelligenceConfidence } from '../enums/intelligence-confidence.enum.js';
import { PowerCondition } from '../enums/power-condition.enum.js';
import { ConclusionState } from '../enums/conclusion-state.enum.js';
import { EvidenceRecencyClassification } from '../evidence/evidence-recency.classification.js';
import { IntelligenceConclusionValidationService } from '../intelligence-conclusion-validation.service.js';
import { PowerIntelligenceService } from '../power-intelligence.service.js';
import { ObservationCategory } from '../../observation/enums/observation-category.enum.js';

import type { PowerIntelligenceInput } from '../types/power-intelligence-input.type.js';
import type { ValidatedConclusion } from '../types/validated-conclusion.type.js';
import type { IntelligenceInterpreter } from '../types/intelligence-interpreter.type.js';

describe('PowerIntelligenceService', () => {
    const observationId = 'a7f6c4b1-2d83-4e91-8b52-6c1d9e3f5a70';

    const input = {
        observations: [{ id: observationId }],
        evidenceAnalysis: {
            recency: [],
            agreement: [],
            temporalAgreement: [],
        },
        evidenceAssessments: [],
    } as unknown as PowerIntelligenceInput;

    const validated: ValidatedConclusion = {
        conclusion: PowerCondition.INTERMITTENT,
        confidence: IntelligenceConfidence.MODERATE,
        reason: 'Recent observations report inconsistent availability.',
        reasonSignals: ['RECENT_EVIDENCE'],
        evidenceReferences: [observationId],
        considerations: ['Verify current supply conditions.'],
    };

    const expectedOutput = {
        ...validated,
        conclusion: ConclusionState.MIXED,
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

    it('returns the validated interpreter result mapped to ConclusionState', async () => {
        vi.mocked(interpreter.interpret).mockResolvedValue(validated);
        vi.mocked(conclusionValidation.validate).mockResolvedValue(validated);

        await expect(service.interpret(input)).resolves.toEqual(expectedOutput);

        expect(interpreter.interpret).toHaveBeenCalledWith(input);
        expect(conclusionValidation.validate).toHaveBeenCalledWith(
            validated,
            new Set([observationId]),
            ObservationCategory.POWER,
        );
    });

    it('rejects the result when validation fails', async () => {
        vi.mocked(interpreter.interpret).mockResolvedValue(validated);
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

    it('forces UNRESOLVED with LOW confidence when all evidence is old', async () => {
        const staleInput = {
            ...input,
            evidenceAnalysis: {
                ...input.evidenceAnalysis,
                recency: [
                    {
                        observationId,
                        category: 'POWER',
                        classification: EvidenceRecencyClassification.OLD,
                    },
                ],
            },
        } as unknown as PowerIntelligenceInput;

        vi.mocked(interpreter.interpret).mockResolvedValue(validated);
        vi.mocked(conclusionValidation.validate).mockResolvedValue(validated);

        await expect(service.interpret(staleInput)).resolves.toMatchObject({
            conclusion: ConclusionState.UNRESOLVED,
            confidence: IntelligenceConfidence.LOW,
            reason:
                'Insufficient recent evidence to determine the current electricity condition.',
            reasonSignals: ['All available observations are old'],
            considerations: [
                'Agreement between old observations cannot establish the current condition.',
            ],
        });
    });

    it('does not override the conclusion when evidence is recent', async () => {
        const recentInput = {
            ...input,
            evidenceAnalysis: {
                ...input.evidenceAnalysis,
                recency: [
                    {
                        observationId,
                        category: 'POWER',
                        classification: EvidenceRecencyClassification.RECENT,
                    },
                ],
            },
        } as unknown as PowerIntelligenceInput;

        vi.mocked(interpreter.interpret).mockResolvedValue(validated);
        vi.mocked(conclusionValidation.validate).mockResolvedValue(validated);

        await expect(service.interpret(recentInput)).resolves.toEqual(
            expectedOutput,
        );
    });

    it('does not treat an empty recency list as entirely old evidence', async () => {
        vi.mocked(interpreter.interpret).mockResolvedValue(validated);
        vi.mocked(conclusionValidation.validate).mockResolvedValue(validated);

        await expect(service.interpret(input)).resolves.toEqual(expectedOutput);
    });
});