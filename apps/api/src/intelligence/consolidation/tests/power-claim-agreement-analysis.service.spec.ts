import { beforeEach, describe, expect, it } from 'vitest';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import { Availability } from '../../../observation/types/common/availability.type.js';
import { PowerSource } from '../../../observation/types/power/power-data.type.js';
import { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';
import type { ConsolidatedEvidence } from '../types/consolidated-evidence.type.js';
import type { PowerClaimData } from '../types/power-claim-data.type.js';
import { PowerClaimAgreementService } from '../strategies/power-claim-agreement.service.js';
import { PowerClaimAgreementClassifier } from '../strategies/power-claim-agreement.classifier.js';
import { PowerClaimAgreementAnalysisService } from '../strategies/power-claim-agreement-analysis.service.js';

describe('PowerClaimAgreementAnalysisService', () => {
    let service: PowerClaimAgreementAnalysisService;
    let agreementService: PowerClaimAgreementService;
    let agreementClassifier: PowerClaimAgreementClassifier;

    beforeEach(() => {
        agreementService = new PowerClaimAgreementService();
        agreementClassifier = new PowerClaimAgreementClassifier();

        service = new PowerClaimAgreementAnalysisService(
            agreementService,
            agreementClassifier,
        );
    });

    function createClaim(
        id: string,
        claimData: PowerClaimData,
        observationIds: string[],
        firstObservedAt: Date,
        lastObservedAt: Date,
        category: ObservationCategory = ObservationCategory.POWER,
    ): ConsolidatedEvidence<PowerClaimData> {
        return {
            id,
            category,
            claimType: 'POWER',
            claimData,
            observationIds,
            firstObservedAt,
            lastObservedAt,
            observationCount: observationIds.length,
        };
    }

    const gridAvailable: PowerClaimData = {
        source: [PowerSource.GRID],
        availability: Availability.AVAILABLE,
    };

    const gridUnavailable: PowerClaimData = {
        source: [PowerSource.GRID],
        availability: Availability.UNAVAILABLE,
    };

    const generatorAvailable: PowerClaimData = {
        source: [PowerSource.GENERATOR],
        availability: Availability.AVAILABLE,
    };

    it('compares each unique pair of power claims exactly once', () => {
        const claims = [
            createClaim('claim-1', gridAvailable, ['obs-1'], new Date('2026-01-01'), new Date('2026-01-01')),
            createClaim('claim-2', gridUnavailable, ['obs-2'], new Date('2026-01-02'), new Date('2026-01-02')),
            createClaim('claim-3', generatorAvailable, ['obs-3'], new Date('2026-01-03'), new Date('2026-01-03')),
        ];

        const results = service.analyze(claims);

        expect(results).toHaveLength(3);
        expect(results.map(({ firstClaimId, secondClaimId }) => [
            firstClaimId,
            secondClaimId,
        ])).toEqual([
            ['claim-1', 'claim-2'],
            ['claim-1', 'claim-3'],
            ['claim-2', 'claim-3'],
        ]);
    });

    it('classifies claims with matching sources and availability as strong agreement', () => {
        const claims = [
            createClaim('claim-1', gridAvailable, ['obs-1'], new Date('2026-01-01'), new Date('2026-01-01')),
            createClaim('claim-2', gridAvailable, ['obs-2'], new Date('2026-01-02'), new Date('2026-01-02')),
        ];

        expect(service.analyze(claims)[0]?.classification).toBe(
            EvidenceAgreementClassification.STRONG_AGREEMENT,
        );
    });

    it('classifies claims with different source combinations as not comparable', () => {
        const claims = [
            createClaim('claim-1', gridAvailable, ['obs-1'], new Date('2026-01-01'), new Date('2026-01-01')),
            createClaim('claim-2', generatorAvailable, ['obs-2'], new Date('2026-01-02'), new Date('2026-01-02')),
        ];

        expect(service.analyze(claims)[0]?.classification).toBe(
            EvidenceAgreementClassification.NOT_COMPARABLE,
        );
    });

    it('preserves claim IDs and observation provenance', () => {
        const claims = [
            createClaim('claim-1', gridAvailable, ['obs-1', 'obs-2'], new Date('2026-01-01'), new Date('2026-01-02')),
            createClaim('claim-2', gridUnavailable, ['obs-3'], new Date('2026-01-03'), new Date('2026-01-04')),
        ];

        const result = service.analyze(claims)[0]!;

        expect(result.firstClaimId).toBe('claim-1');
        expect(result.secondClaimId).toBe('claim-2');
        expect(result.firstObservationIds).toEqual(['obs-1', 'obs-2']);
        expect(result.secondObservationIds).toEqual(['obs-3']);
        expect(result.sharedObservationIds).toEqual([]);
    });

    it('calculates the time difference between the claims’ latest observations', () => {
        const claims = [
            createClaim('claim-1', gridAvailable, ['obs-1'], new Date('2026-01-01'), new Date('2026-01-01')),
            createClaim('claim-2', gridUnavailable, ['obs-2'], new Date('2026-01-03'), new Date('2026-01-04')),
        ];

        expect(service.analyze(claims)[0]?.timeDifferenceInDays).toBe(3);
    });

    it('returns an empty array when fewer than two power claims exist', () => {
        const singleClaim = createClaim(
            'claim-1',
            gridAvailable,
            ['obs-1'],
            new Date('2026-01-01'),
            new Date('2026-01-01'),
        );

        expect(service.analyze([singleClaim])).toEqual([]);
        expect(service.analyze([])).toEqual([]);
    });

    it('ignores claims from other categories', () => {
        const powerClaim = createClaim(
            'claim-1',
            gridAvailable,
            ['obs-1'],
            new Date('2026-01-01'),
            new Date('2026-01-01'),
        );

        const nonPowerClaim = createClaim(
            'claim-2',
            gridUnavailable,
            ['obs-2'],
            new Date('2026-01-02'),
            new Date('2026-01-02'),
            ObservationCategory.WATER,
        );

        expect(service.analyze([powerClaim, nonPowerClaim])).toEqual([]);
    });

    it('does not mutate the input claims', () => {
        const claims = [
            createClaim('claim-1', gridAvailable, ['obs-1'], new Date('2026-01-01'), new Date('2026-01-01')),
            createClaim('claim-2', gridUnavailable, ['obs-2'], new Date('2026-01-02'), new Date('2026-01-02')),
        ];

        const original = structuredClone(claims);

        service.analyze(claims);

        expect(claims).toEqual(original);
    });
});