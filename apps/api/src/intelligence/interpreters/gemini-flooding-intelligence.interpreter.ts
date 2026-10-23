import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { GeminiClient } from '../llm/gemini.client.js';
import { FloodingIntelligencePrompt } from '../prompts/flooding-intelligence.prompt.js';
import type { IntelligenceConclusion } from '../types/intelligence-conclusion.type.js';
import type { FloodingIntelligenceInput } from '../types/flooding-intelligence-input.type.js';
import type { IntelligenceInterpreter } from '../types/intelligence-interpreter.type.js';

@Injectable()
export class GeminiFloodingIntelligenceInterpreter
    implements IntelligenceInterpreter<FloodingIntelligenceInput>
{
    constructor(
        private readonly geminiClient: GeminiClient,
        private readonly promptBuilder: FloodingIntelligencePrompt,
    ) {}

    async interpret(
        input: FloodingIntelligenceInput,
    ): Promise<IntelligenceConclusion> {
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

            return parsed as IntelligenceConclusion;
        } catch {
            throw new InternalServerErrorException(
                'Gemini returned invalid JSON for flooding intelligence.',
            );
        }
    }
}