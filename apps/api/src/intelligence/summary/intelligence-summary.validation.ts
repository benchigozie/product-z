import { Injectable, Logger } from '@nestjs/common';

import type { IntelligenceSummaryOutput } from './types/intelligence-summary.types.js';

const ENUM_NAMES = [
    'UNRESOLVED',
    'SECURE',
    'CAUTIOUS',
    'INSECURE',
    'SOUND',
    'CONCERNING',
    'UNSAFE',
    'SANITARY',
    'UNSANITARY',
    'WELL_ACCESSIBLE',
    'ACCESSIBLE_BUT_POOR',
    'LIMITED_ACCESS',
];
@Injectable()
export class IntelligenceSummaryValidationService {
    private readonly logger = new Logger(
        IntelligenceSummaryValidationService.name,
    );

    validateAndNormalize(
        value: unknown,
    ): IntelligenceSummaryOutput | null {
        if (
            typeof value !== 'object' ||
            value === null ||
            Array.isArray(value)
        ) {
            this.logger.warn(
                'Summary response is not a plain object; rejecting.',
            );
            return null;
        }

        const record = value as Record<string, unknown>;

        if (!Array.isArray(record.variants)) {
            this.logger.warn(
                'Summary response has no variants array; rejecting.',
            );
            return null;
        }

        const variants = record.variants.filter(
            (v): v is string =>
                typeof v === 'string' && v.trim().length > 0,
        );

        if (variants.length === 0) {
            this.logger.warn(
                'Summary response contains no non-empty variants; rejecting.',
            );
            return null;
        }

        if (variants.length < 5) {
            this.logger.warn(
                `Summary returned ${variants.length} variants (expected 5); accepting.`,
            );
        }

        for (const variant of variants) {
            const upper = variant.toUpperCase();
            for (const enumName of ENUM_NAMES) {
                if (upper.includes(enumName)) {
                    this.logger.warn(
                        `Summary variant contains enum name "${enumName}": "${variant}"`,
                    );
                    break;
                }
            }

            if (variant.length < 40) {
                this.logger.warn(
                    `Summary variant is suspiciously short (${variant.length} chars).`,
                );
            }

            if (variant.length > 800) {
                this.logger.warn(
                    `Summary variant is suspiciously long (${variant.length} chars).`,
                );
            }
        }

        return { variants };
    }
}