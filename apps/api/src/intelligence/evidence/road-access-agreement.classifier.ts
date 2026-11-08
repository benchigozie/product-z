import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from './evidence-agreement.classification.js';
import type { RoadAccessAgreementResult } from './types/road-access-agreement.type.js';

@Injectable()
export class RoadAccessAgreementClassifier {
    classify(
        result: RoadAccessAgreementResult,
    ): EvidenceAgreementClassification {
        switch (result.accessibilityDifference) {
            case 0:
                return EvidenceAgreementClassification.STRONG_AGREEMENT;

            case 1:
                return EvidenceAgreementClassification.MIXED_AGREEMENT;

            case 2:
            case 3:
                return EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE;

            default:
                throw new Error(
                    `Unreachable: accessibilityDifference must be 0-3; got ${result.accessibilityDifference}`,
                );
        }
    }
}