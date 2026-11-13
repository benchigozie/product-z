import { Injectable, Logger } from '@nestjs/common';

import { GeminiClient } from '../llm/gemini.client.js';
import { ObservationIngestionPrompt } from './prompts/observation-ingestion.prompt.js';
import { ObservationIngestionValidationService } from './observation-ingestion.validation.js';
import type { ObservationIngestionResult } from './types/observation-ingestion.types.js';

@Injectable()
export class ObservationIngestionService {
    private readonly logger = new Logger(
        ObservationIngestionService.name,
    );

    constructor(
        private readonly geminiClient: GeminiClient,
        private readonly promptBuilder: ObservationIngestionPrompt,
        private readonly validation: ObservationIngestionValidationService,
    ) {}

    async parse(text: string): Promise<ObservationIngestionResult> {
        const trimmed = text.trim();

        if (trimmed.length === 0) {
            return { observations: [], rejected: [] };
        }

        const prompt = this.promptBuilder.build(trimmed);

        let responseText: string;

        try {
            responseText = await this.geminiClient.generateJson(prompt);
        } catch (error) {
            this.logger.error(
                `Ingestion parse failed: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
            return { observations: [], rejected: [] };
        }

        let parsed: unknown;

        try {
            parsed = JSON.parse(responseText);
        } catch {
            this.logger.error(
                'Ingestion response was not valid JSON.',
            );
            return { observations: [], rejected: [] };
        }

        return this.validation.validateAndNormalize(parsed);
    }
}