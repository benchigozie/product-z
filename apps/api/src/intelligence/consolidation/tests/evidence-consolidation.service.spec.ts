import { describe, expect, it, vi } from 'vitest';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';
import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { EvidenceConsolidationStrategy } from '../types/evidence-consolidation-strategy.type.js';
import {
    EvidenceConsolidationService,
} from '../evidence-consolidation.service.js';

describe('EvidenceConsolidationService', () => {
    it('delegates observations to the matching category strategy', () => {
        const powerObservation = {
            id: 'power-1',
            category: ObservationCategory.POWER,
        };

        const waterObservation = {
            id: 'water-1',
            category: ObservationCategory.WATER,
        };

        const observations = [
            powerObservation,
            waterObservation,
        ] as ObservationListResult;

        const powerResult = {
            id: 'power-claim-1',
            category: ObservationCategory.POWER,
            claimType: 'POWER_SOURCE_AVAILABILITY',
            claimData: {},
            observationIds: ['power-1'],
            firstObservedAt: new Date('2026-10-01T10:00:00.000Z'),
            lastObservedAt: new Date('2026-10-01T10:00:00.000Z'),
            observationCount: 1,
        } satisfies ConsolidatedEvidence;

        const powerStrategy: EvidenceConsolidationStrategy = {
            category: ObservationCategory.POWER,
            consolidate: vi.fn(() => [powerResult]),
        };

        const waterStrategy: EvidenceConsolidationStrategy = {
            category: ObservationCategory.WATER,
            consolidate: vi.fn(() => []),
        };

        const service = new EvidenceConsolidationService([
            powerStrategy,
            waterStrategy,
        ]);

        const result = service.consolidate(observations);

        expect(powerStrategy.consolidate).toHaveBeenCalledWith([
            powerObservation,
        ]);

        expect(waterStrategy.consolidate).toHaveBeenCalledWith([
            waterObservation,
        ]);

        expect(result).toEqual([powerResult]);
    });

    it('combines results returned by multiple strategies', () => {
        const powerClaim = {
            id: 'power-claim-1',
            category: ObservationCategory.POWER,
            claimType: 'POWER_SOURCE_AVAILABILITY',
            claimData: {},
            observationIds: ['power-1'],
            firstObservedAt: new Date('2026-10-01T10:00:00.000Z'),
            lastObservedAt: new Date('2026-10-01T10:00:00.000Z'),
            observationCount: 1,
        } satisfies ConsolidatedEvidence;

        const waterClaim = {
            id: 'water-claim-1',
            category: ObservationCategory.WATER,
            claimType: 'WATER_AVAILABILITY',
            claimData: {},
            observationIds: ['water-1'],
            firstObservedAt: new Date('2026-10-01T11:00:00.000Z'),
            lastObservedAt: new Date('2026-10-01T11:00:00.000Z'),
            observationCount: 1,
        } satisfies ConsolidatedEvidence;

        const powerStrategy: EvidenceConsolidationStrategy = {
            category: ObservationCategory.POWER,
            consolidate: vi.fn(() => [powerClaim]),
        };

        const waterStrategy: EvidenceConsolidationStrategy = {
            category: ObservationCategory.WATER,
            consolidate: vi.fn(() => [waterClaim]),
        };

        const service = new EvidenceConsolidationService([
            powerStrategy,
            waterStrategy,
        ]);

        const result = service.consolidate(
            [] as ObservationListResult,
        );

        expect(result).toEqual([powerClaim, waterClaim]);
    });

    it('returns an empty array when there are no observations', () => {
        const powerStrategy: EvidenceConsolidationStrategy = {
            category: ObservationCategory.POWER,
            consolidate: vi.fn(() => []),
        };

        const service = new EvidenceConsolidationService([
            powerStrategy,
        ]);

        const result = service.consolidate(
            [] as ObservationListResult,
        );

        expect(result).toEqual([]);
        expect(powerStrategy.consolidate).toHaveBeenCalledWith([]);
    });
});