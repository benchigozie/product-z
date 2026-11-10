import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { GeminiClient } from '../llm/gemini.client.js';
import { BuildingConditionIntelligencePrompt } from '../prompts/building-condition-intelligence.prompt.js';
import type { BuildingConditionIntelligenceInput } from '../types/building-condition-intelligence-input.type.js';
import type { IntelligenceInterpreter } from '../types/intelligence-interpreter.type.js';
import type { ValidatedConclusion } from '../types/validated-conclusion.type.js';

@Injectable()
export class GeminiBuildingConditionIntelligenceInterpreter
    implements IntelligenceInterpreter<BuildingConditionIntelligenceInput>
{
    constructor(
        private readonly geminiClient: GeminiClient,
        private readonly promptBuilder: BuildingConditionIntelligencePrompt,
    ) {}

    async interpret(
        input: BuildingConditionIntelligenceInput,
    ): Promise<ValidatedConclusion> {
        const prompt = this.promptBuilder.build(input);

        let text: string;

        try {
            text = await this.geminiClient.generateJson(prompt);
        } catch {
            throw new InternalServerErrorException(
                'Gemini could not be reached or returned an error.',
            );
        }

        try {
            const parsed: unknown = JSON.parse(text);

            if (
                typeof parsed !== 'object' ||
                parsed === null ||
                Array.isArray(parsed)
            ) {
                throw new Error('Expected a JSON object.');
            }

            return parsed as ValidatedConclusion;
        } catch {
            throw new InternalServerErrorException(
                'Gemini returned invalid JSON for building condition intelligence.',
            );
        }
    }
}