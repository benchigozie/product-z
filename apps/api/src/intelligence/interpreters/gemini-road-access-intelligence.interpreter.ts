import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { GeminiClient } from '../llm/gemini.client.js';
import { RoadAccessIntelligencePrompt } from '../prompts/road-access-intelligence.prompt.js';
import type { RoadAccessIntelligenceInput } from '../types/road-access-intelligence-input.type.js';
import type { IntelligenceInterpreter } from '../types/intelligence-interpreter.type.js';
import type { ValidatedConclusion } from '../types/validated-conclusion.type.js';

@Injectable()
export class GeminiRoadAccessIntelligenceInterpreter
    implements IntelligenceInterpreter<RoadAccessIntelligenceInput>
{
    constructor(
        private readonly geminiClient: GeminiClient,
        private readonly promptBuilder: RoadAccessIntelligencePrompt,
    ) {}

    async interpret(
        input: RoadAccessIntelligenceInput,
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
                'Gemini returned invalid JSON for road access intelligence.',
            );
        }
    }
}