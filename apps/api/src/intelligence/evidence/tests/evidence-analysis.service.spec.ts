
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import { Availability } from '../../../observation/types/common/availability.type.js';
import { Reliability } from '../../../observation/types/common/reliability.type.js';
import { PowerSource } from '../../../observation/types/power/power-data.type.js';
import type { ObservationListResult } from '../../../observation/types/observation-result.type.js';

import { EvidenceRecencyClassification } from '../evidence-recency.classification.js';
import { EvidenceAgreementClassification } from '../evidence-agreement.classification.js';
import { EvidenceAnalysisService } from '../evidence-analysis.service.js';
import { EvidenceRecencyService } from '../evidence-recency.service.js';
import { PowerAgreementService } from '../../power-agreement.service.js';
import { PowerAgreementClassifier } from '../../power-agreement-classifier.js';
import { EvidenceTemporalAnalysisService } from '../evidence-temporal-analysis.service.js';
import {
    TemporalAgreementInterpretation,
} from '../types/temporal-agreement-analysis.type.js';
import type { TemporalAgreementAnalysis } from '../types/temporal-agreement-analysis.type.js';

describe('EvidenceAnalysisService', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    const recencyService = {
        classify: vi.fn(),
    } as unknown as EvidenceRecencyService;

    const agreementService = {
        compare: vi.fn(),
    } as unknown as PowerAgreementService;

    const agreementClassifier = {
        classify: vi.fn(),
    } as unknown as PowerAgreementClassifier;

    const temporalAnalysisService = {
        analyze: vi.fn(),
    } as unknown as EvidenceTemporalAnalysisService;

    const service = new EvidenceAnalysisService(
        recencyService,
        agreementService,
        agreementClassifier,
        temporalAnalysisService
    );

    function createObservation(
        id: string,
        category: ObservationCategory,
        daysAgo: number,
        data: unknown = null,
    ) {
        return {
            id,
            category,
            observedAt: {
                epochMilliseconds:
                    Date.now() - daysAgo * 24 * 60 * 60 * 1000,
            },
            data,
        };
    }

    it('returns empty arrays when there are no observations', async () => {
        const result = await service.analyze(
            [] as ObservationListResult,
        );

        expect(result).toEqual({
            recency: [],
            powerAgreement: [],
            temporalAgreement: [],
        });

        expect(agreementService.compare).not.toHaveBeenCalled();
        expect(recencyService.classify).not.toHaveBeenCalled();
    });

    it('returns a recency result for every observation', async () => {
        const observations = [
            createObservation('power-1', ObservationCategory.POWER, 2),
            createObservation('water-1', ObservationCategory.WATER, 10),
        ] as unknown as ObservationListResult;

        vi.mocked(recencyService.classify)
            .mockReturnValue(EvidenceRecencyClassification.RECENT);

        const result = await service.analyze(observations);

        expect(result.recency).toEqual([
            {
                observationId: 'power-1',
                category: ObservationCategory.POWER,
                classification: EvidenceRecencyClassification.RECENT,
            },
            {
                observationId: 'water-1',
                category: ObservationCategory.WATER,
                classification: EvidenceRecencyClassification.RECENT,
            },
        ]);

        expect(recencyService.classify).toHaveBeenCalledTimes(2);
    });

    it('compares every valid pair of power observations', async () => {
        const powerData = {
            source: [PowerSource.GRID],
            availability: Availability.INTERMITTENT,
            reliability: Reliability.GOOD,
        };

        const observations = [
            createObservation('power-1', ObservationCategory.POWER, 2, powerData),
            createObservation('power-2', ObservationCategory.POWER, 3, powerData),
            createObservation('water-1', ObservationCategory.WATER, 5),
        ] as unknown as ObservationListResult;

        vi.mocked(recencyService.classify)
            .mockReturnValue(EvidenceRecencyClassification.RECENT);

        vi.mocked(agreementService.compare).mockReturnValue({
            availabilityDifference: 0,
            reliabilityDifference: 0,
        });

        vi.mocked(agreementClassifier.classify).mockReturnValue(
            EvidenceAgreementClassification.STRONG_AGREEMENT,
        );

        vi.mocked(temporalAnalysisService.analyze).mockReturnValue({
            firstObservationId: 'power-1',
            secondObservationId: 'power-2',
            agreementClassification: EvidenceAgreementClassification.STRONG_AGREEMENT,
            interpretation: TemporalAgreementInterpretation.CONSISTENT,
            timeDifferenceInDays: 1,
        } satisfies TemporalAgreementAnalysis);

        const result = await service.analyze(observations);

        expect(agreementService.compare).toHaveBeenCalledTimes(1);
        expect(agreementClassifier.classify).toHaveBeenCalledTimes(1);

        expect(temporalAnalysisService.analyze).toHaveBeenCalledTimes(1);

        expect(result.temporalAgreement).toEqual([
            {
                firstObservationId: 'power-1',
                secondObservationId: 'power-2',
                agreementClassification: EvidenceAgreementClassification.STRONG_AGREEMENT,
                interpretation: TemporalAgreementInterpretation.CONSISTENT,
                timeDifferenceInDays: 1,
            },
        ]);

        expect(result.powerAgreement).toHaveLength(1);
        expect(result.powerAgreement[0]).toMatchObject({
            firstObservationId: 'power-1',
            secondObservationId: 'power-2',
            classification: EvidenceAgreementClassification.STRONG_AGREEMENT,
            agreement: {
                availabilityDifference: 0,
                reliabilityDifference: 0,
            },
        });
        expect(result.powerAgreement[0].timeDifferenceInDays).toBeCloseTo(1);
        expect(temporalAnalysisService.analyze).toHaveBeenCalledTimes(1);
    });

    it('skips power comparisons when observation data is invalid', async () => {
        const observations = [
            createObservation('power-1', ObservationCategory.POWER, 2, {
                source: [],
                availability: 'INVALID',
            }),
            createObservation('power-2', ObservationCategory.POWER, 3, {
                source: [PowerSource.GRID],
                availability: Availability.AVAILABLE,
            }),
        ] as unknown as ObservationListResult;

        vi.spyOn(console, 'warn').mockImplementation(() => { });

        vi.mocked(recencyService.classify)
            .mockReturnValue(EvidenceRecencyClassification.RECENT);

        const result = await service.analyze(observations);

        expect(agreementService.compare).not.toHaveBeenCalled();
        expect(result.powerAgreement).toEqual([]);
        expect(result.recency).toHaveLength(2);
        expect(console.warn).toHaveBeenCalledOnce();
    });
});
