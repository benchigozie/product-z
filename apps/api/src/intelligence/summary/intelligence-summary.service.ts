import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../prisma.service.js';
import { GeminiClient } from '../llm/gemini.client.js';
import {
    IntelligenceSummaryPrompt,
    type CategoryIntelligenceForSummary,
    type SummarySubjectType,
} from './prompts/intelligence-summary.prompt.js';
import { IntelligenceSummaryValidationService } from './intelligence-summary.validation.js';
import type { IntelligenceSummary } from './types/intelligence-summary.types.js';

@Injectable()
export class IntelligenceSummaryService {
    private readonly logger = new Logger(
        IntelligenceSummaryService.name,
    );

    constructor(
        private readonly prisma: PrismaService,
        private readonly geminiClient: GeminiClient,
        private readonly promptBuilder: IntelligenceSummaryPrompt,
        private readonly validation: IntelligenceSummaryValidationService,
    ) {}

    async generateForProperty(
        propertyId: string,
    ): Promise<IntelligenceSummary | null> {
        const intelligence =
            await this.prisma.db.orm.public.Intelligence
                .where({ propertyId })
                .first();

        if (!intelligence) {
            this.logger.warn(
                `No intelligence row for property ${propertyId}; skipping summary.`,
            );
            return null;
        }

        const property = await this.prisma.db.orm.public.Property
            .where({ id: propertyId })
            .first();

        const subjectName = property?.name ?? propertyId;

        return this.summarize(
            'PROPERTY',
            subjectName,
            intelligence.categories as Record<string, any> | null,
        );
    }

    async generateForPlace(
        placeId: string,
    ): Promise<IntelligenceSummary | null> {
        const intelligence =
            await this.prisma.db.orm.public.Intelligence
                .where({ placeId })
                .first();

        if (!intelligence) {
            this.logger.warn(
                `No intelligence row for place ${placeId}; skipping summary.`,
            );
            return null;
        }

        const place = await this.prisma.db.orm.public.Place
            .where({ id: placeId })
            .first();

        const subjectName = place?.name ?? placeId;

        return this.summarize(
            'PLACE',
            subjectName,
            intelligence.categories as Record<string, any> | null,
        );
    }

    private async summarize(
        subjectType: SummarySubjectType,
        subjectName: string,
        categories: Record<string, any> | null,
    ): Promise<IntelligenceSummary | null> {
        if (!categories) {
            this.logger.warn(
                `Intelligence has no categories; skipping summary.`,
            );
            return null;
        }

        const categoryEntries: CategoryIntelligenceForSummary[] =
            Object.entries(categories)
                .filter(
                    ([, value]) =>
                        value &&
                        typeof value === 'object' &&
                        'conclusion' in value &&
                        'confidence' in value &&
                        'reason' in value,
                )
                .map(([key, value]) => ({
                    category: key.toUpperCase(),
                    conclusion: value.conclusion,
                    confidence: value.confidence,
                    reason: value.reason,
                    considerations: Array.isArray(value.considerations)
                        ? value.considerations
                        : [],
                }));

        if (categoryEntries.length === 0) {
            this.logger.warn(
                `No valid category entries for ${subjectType} "${subjectName}"; skipping summary.`,
            );
            return null;
        }

        const prompt = this.promptBuilder.build(
            subjectType,
            subjectName,
            categoryEntries,
        );

        let responseText: string;

        try {
            responseText =
                await this.geminiClient.generateJson(prompt);
        } catch (error) {
            this.logger.error(
                `Summary generation failed for ${subjectType} "${subjectName}": ${
                    error instanceof Error
                        ? error.message
                        : String(error)
                }`,
            );
            return null;
        }

        let parsed: unknown;

        try {
            parsed = JSON.parse(responseText);
        } catch {
            this.logger.error(
                `Summary response was not valid JSON for ${subjectType} "${subjectName}".`,
            );
            return null;
        }

        const validated = this.validation.validateAndNormalize(parsed);

        if (!validated) {
            return null;
        }

        return {
            primary: validated.variants[0]!,
            variants: validated.variants,
            generatedAt: new Date().toISOString(),
        };
    }
}