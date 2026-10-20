import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from './evidence/evidence-agreement.classification.js';
import type { PowerAgreementResult } from './evidence/power-agreement.js';

@Injectable()
export class PowerAgreementClassifier {
    classify(
        result: PowerAgreementResult,
    ): EvidenceAgreementClassification {
        switch (result.availabilityDifference) {
            case 0:
                return EvidenceAgreementClassification.STRONG_AGREEMENT;

            case 1:
                return EvidenceAgreementClassification.MIXED_AGREEMENT;

            case 2:
                return EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE;

            default:
                throw new Error(
                    `Unreachable: availabilityDifference must be 0, 1, or 2; got ${result.availabilityDifference}`,
                );
        }
    }
}