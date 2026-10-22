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
                this.logger.error('Gemini returned an empty response.');
                throw new Error('Gemini returned an empty response.');
            }
    
            return text;
        } catch (error) {
            this.logger.error(
                `Gemini request failed: ${
                    error instanceof Error ? error.message : String(error)
                }`,
            );
            if (error instanceof Error && error.stack) {
                this.logger.error(error.stack);
            }
            throw error;
        }
    }
}