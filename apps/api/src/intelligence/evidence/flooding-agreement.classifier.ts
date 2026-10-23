import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from './evidence-agreement.classification.js';
import type { FloodingAgreementResult } from './types/flooding-agreement.type.js';

@Injectable()
export class FloodingAgreementClassifier {
    classify(
        result: FloodingAgreementResult,
    ): EvidenceAgreementClassification {
        switch (result.occurrenceDifference) {
            case 0:
                return EvidenceAgreementClassification.STRONG_AGREEMENT;

            case 1:
                return EvidenceAgreementClassification.MIXED_AGREEMENT;

            case 2:
                return EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE;

            default:
                throw new Error(
                    `Unreachable: occurrenceDifference must be 0, 1, or 2; got ${result.occurrenceDifference}`,
                );
        }
    }
}