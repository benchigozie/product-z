import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { GeminiClient } from '../llm/gemini.client.js';
import { SanitationIntelligencePrompt } from '../prompts/sanitation-intelligence.prompt.js';
import type { SanitationIntelligenceInput } from '../types/sanitation-intelligence-input.type.js';
import type { IntelligenceInterpreter } from '../types/intelligence-interpreter.type.js';
import type { ValidatedConclusion } from '../types/validated-conclusion.type.js';

@Injectable()
export class GeminiSanitationIntelligenceInterpreter
    implements IntelligenceInterpreter<SanitationIntelligenceInput>
{
    constructor(
        private readonly geminiClient: GeminiClient,
        private readonly promptBuilder: SanitationIntelligencePrompt,
    ) {}

    async interpret(
        input: SanitationIntelligenceInput,
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
                'Gemini returned invalid JSON for sanitation intelligence.',
            );
        }
    }
}