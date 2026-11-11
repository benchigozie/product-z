import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiClient {
    private readonly logger = new Logger(GeminiClient.name);
    private readonly client: GoogleGenAI;
    readonly model: string;

    constructor(private readonly config: ConfigService) {
        const apiKey = this.config.get<string>('GEMINI_API_KEY');
        if (!apiKey) {
            throw new Error(
                'GEMINI_API_KEY is required to run the intelligence module.',
            );
        }

        this.client = new GoogleGenAI({ apiKey });
        this.model =
            this.config.get<string>('GEMINI_MODEL') ?? 'gemini-2.5-flash-lite';
    }

    async generateJson(prompt: string): Promise<string> {
        const maxAttempts = 3;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const response = await this.client.models.generateContent({
                    model: this.model,
                    contents: prompt,
                    config: {
                        temperature: 0,
                        responseMimeType: 'application/json',
                    },
                });

                const text = response.text;

                if (typeof text !== 'string' || text.length === 0) {
                    throw new Error('Gemini returned an empty response.');
                }

                return text;
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : String(error);

                const isTransient =
                    message.includes('503') ||
                    message.includes('UNAVAILABLE') ||
                    message.includes('429') ||
                    message.includes('RESOURCE_EXHAUSTED') ||
                    message.includes('overloaded');

                if (!isTransient || attempt === maxAttempts) {
                    this.logger.error(
                        `Gemini request failed (attempt ${attempt}/${maxAttempts}): ${message}`,
                    );
                    if (error instanceof Error && error.stack) {
                        this.logger.error(error.stack);
                    }
                    throw error;
                }

                const delayMs = Math.pow(2, attempt) * 1000;
                this.logger.warn(
                    `Gemini transient error (attempt ${attempt}/${maxAttempts}); retrying in ${delayMs}ms: ${message}`,
                );

                await new Promise((resolve) => setTimeout(resolve, delayMs));
            }
        }

        throw new Error('Gemini retry loop exited unexpectedly.');
    }
}