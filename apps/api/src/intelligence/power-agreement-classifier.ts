import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from './evidence/evidence-agreement.classification.js';
import type { PowerAgreementResult } from './evidence/power-agreement.js';

@Injectable()
export class PowerAgreementClassifier {
    classify(
        result: PowerAgreementResult,
    ): EvidenceAgreementClassification {
        const availabilityDifference =
            result.availabilityDifference;

        const reliabilityDifference =
            result.reliabilityDifference;

        if (
            availabilityDifference === 2 ||
            reliabilityDifference !== null &&
            reliabilityDifference >= 3
        ) {
            return EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE;
        }

        if (
            availabilityDifference === 0 &&
            (
                reliabilityDifference === null ||
                reliabilityDifference <= 1
            )
        ) {
            return EvidenceAgreementClassification.STRONG_AGREEMENT;
        }

        return EvidenceAgreementClassification.MIXED_AGREEMENT;
    }
}