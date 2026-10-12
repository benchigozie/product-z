
import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from './evidence-agreement.classification.js';
import {
    POWER_TEMPORAL_CHANGE_THRESHOLD_DAYS,
} from './evidence-temporal.rules.js';
import {
    TemporalAgreementInterpretation,
} from './types/temporal-agreement-analysis.type.js';
import type {
    TemporalAgreementAnalysis,
} from './types/temporal-agreement-analysis.type.js';

@Injectable()
export class EvidenceTemporalAnalysisService {
    analyze(
        firstObservationId: string,
        secondObservationId: string,
        agreementClassification: EvidenceAgreementClassification,
        timeDifferenceInDays: number,
    ): TemporalAgreementAnalysis {
        if (
            agreementClassification ===
            EvidenceAgreementClassification.STRONG_AGREEMENT
        ) {
            return {
                firstObservationId,
                secondObservationId,
                agreementClassification,
                interpretation:
                    TemporalAgreementInterpretation.CONSISTENT,
                timeDifferenceInDays,
            };
        }

        if (
            agreementClassification ===
                EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE &&
            timeDifferenceInDays >= POWER_TEMPORAL_CHANGE_THRESHOLD_DAYS
        ) {
            return {
                firstObservationId,
                secondObservationId,
                agreementClassification,
                interpretation:
                    TemporalAgreementInterpretation.POSSIBLE_CHANGE,
                timeDifferenceInDays,
            };
        }

        return {
            firstObservationId,
            secondObservationId,
            agreementClassification,
            interpretation:
                TemporalAgreementInterpretation.UNRESOLVED_DISAGREEMENT,
            timeDifferenceInDays,
        };
    }
}
