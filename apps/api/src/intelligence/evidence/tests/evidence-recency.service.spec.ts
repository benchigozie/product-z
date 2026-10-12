
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Temporal } from '@js-temporal/polyfill';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ObservationResult } from '../../../observation/types/observation-result.type.js';
import { EvidenceRecencyClassification } from '../evidence-recency.classification.js';
import { EvidenceRecencyService } from '../evidence-recency.service.js';

describe('EvidenceRecencyService', () => {
    const service = new EvidenceRecencyService();

    const now = new Date('2026-10-10T12:00:00.000Z');

    afterEach(() => {
        vi.useRealTimers();
    });

    function createObservation(
        daysAgo: number,
    ): NonNullable<ObservationResult> {
        const observedAt = Temporal.Instant.fromEpochMilliseconds(
            now.getTime() - daysAgo * 24 * 60 * 60 * 1000,
        );
    
        return {
            id: 'observation-1',
            category: ObservationCategory.POWER,
            observedAt,
        } as NonNullable<ObservationResult>;
    }

    it('classifies an observation within the recent threshold as RECENT', () => {
        vi.useFakeTimers();
        vi.setSystemTime(now);

        expect(service.classify(createObservation(30))).toBe(
            EvidenceRecencyClassification.RECENT,
        );
    });

    it('classifies an observation just beyond the recent threshold as NEITHER', () => {
        vi.useFakeTimers();
        vi.setSystemTime(now);

        expect(service.classify(createObservation(31))).toBe(
            EvidenceRecencyClassification.NEITHER,
        );
    });

    it('classifies an observation at the old threshold as NEITHER', () => {
        vi.useFakeTimers();
        vi.setSystemTime(now);

        expect(service.classify(createObservation(180))).toBe(
            EvidenceRecencyClassification.NEITHER,
        );
    });

    it('classifies an observation beyond the old threshold as OLD', () => {
        vi.useFakeTimers();
        vi.setSystemTime(now);

        expect(service.classify(createObservation(181))).toBe(
            EvidenceRecencyClassification.OLD,
        );
    });

    it('classifies a current observation as RECENT', () => {
        vi.useFakeTimers();
        vi.setSystemTime(now);

        expect(service.classify(createObservation(0))).toBe(
            EvidenceRecencyClassification.RECENT,
        );
    });
});
