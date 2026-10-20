import { describe, expect, it } from 'vitest';

import { PowerEvidenceConsolidator } from '../strategies/power-evidence-consolidator.service.js';

import { createPowerObservation } from '../../development/fixtures/power-observation.factory.js';

import { Availability } from '../../../observation/types/common/availability.type.js';
import { Reliability } from '../../../observation/types/common/reliability.type.js';
import { PowerSource } from '../../../observation/types/power/power-data.type.js';
import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';

describe('PowerEvidenceConsolidator', () => {
    const consolidator = new PowerEvidenceConsolidator();

    it('groups observations with matching sources and availability', () => {
        const observations = [
            createPowerObservation({
                id: 'observation-1',
                observedAt: new Date('2026-10-10T12:00:00.000Z'),
                availability: Availability.AVAILABLE,
            }),
            createPowerObservation({
                id: 'observation-2',
                observedAt: new Date('2026-10-11T12:00:00.000Z'),
                availability: Availability.AVAILABLE,
            }),
        ];

        const result = consolidator.consolidate(observations);

        expect(result).toHaveLength(1);
        expect(result[0].observationIds).toEqual([
            'observation-1',
            'observation-2',
        ]);
        expect(result[0].observationCount).toBe(2);
    });

    it('keeps different availability values in separate groups', () => {
        const observations = [
            createPowerObservation({
                id: 'available',
                availability: Availability.AVAILABLE,
            }),
            createPowerObservation({
                id: 'unavailable',
                availability: Availability.UNAVAILABLE,
            }),
        ];

        const result = consolidator.consolidate(observations);

        expect(result).toHaveLength(2);
    });

    it('keeps different source combinations in separate groups', () => {
        const observations = [
            createPowerObservation({
                id: 'grid',
                source: [PowerSource.GRID],
            }),
            createPowerObservation({
                id: 'generator',
                source: [PowerSource.GENERATOR],
            }),
        ];

        const result = consolidator.consolidate(observations);

        expect(result).toHaveLength(2);
    });

    it('treats source combinations as equal regardless of order', () => {
        const observations = [
            createPowerObservation({
                id: 'grid-generator',
                source: [PowerSource.GRID, PowerSource.GENERATOR],
            }),
            createPowerObservation({
                id: 'generator-grid',
                source: [PowerSource.GENERATOR, PowerSource.GRID],
            }),
        ];

        const result = consolidator.consolidate(observations);

        expect(result).toHaveLength(1);
        expect(result[0].observationCount).toBe(2);
    });

    it('preserves the earliest and latest observation times', () => {
        const observations = [
            createPowerObservation({
                id: 'latest',
                observedAt: new Date('2026-10-12T12:00:00.000Z'),
            }),
            createPowerObservation({
                id: 'earliest',
                observedAt: new Date('2026-10-08T12:00:00.000Z'),
            }),
        ];

        const result = consolidator.consolidate(observations);

        expect(result).toHaveLength(1);
        expect(result[0].firstObservedAt).toEqual(
            new Date('2026-10-08T12:00:00.000Z'),
        );
        expect(result[0].lastObservedAt).toEqual(
            new Date('2026-10-12T12:00:00.000Z'),
        );
    });

    it('does not split a group because reliability differs', () => {
        const observations = [
            createPowerObservation({
                id: 'good',
                reliability: Reliability.GOOD,
            }),
            createPowerObservation({
                id: 'poor',
                reliability: Reliability.POOR,
            }),
        ];

        const result = consolidator.consolidate(observations);

        expect(result).toHaveLength(1);
        expect(result[0].observationCount).toBe(2);
    });

    it('ignores observations from other categories', () => {
        const observation = {
            ...createPowerObservation({ id: 'not-power' }),
            category: ObservationCategory.WATER,
        };

        const result = consolidator.consolidate([observation]);

        expect(result).toEqual([]);
    });

    it('skips observations with invalid Power data', () => {
        const observation = {
            ...createPowerObservation({ id: 'invalid-power' }),
            data: {
                source: [],
                availability: 'UNKNOWN',
            },
        };

        const result = consolidator.consolidate([observation]);

        expect(result).toEqual([]);
    });
});