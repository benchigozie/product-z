import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from './evidence-agreement.classification.js';
import type { SecurityAgreementResult } from './types/security-agreement.type.js';

@Injectable()
export class SecurityAgreementClassifier {
    classify(
        result: SecurityAgreementResult,
    ): EvidenceAgreementClassification {
        if (result.accessControlDifference === -1) {
            return EvidenceAgreementClassification.NOT_COMPARABLE;
        }

        switch (result.accessControlDifference) {
            case 0:
                return EvidenceAgreementClassification.STRONG_AGREEMENT;

            case 1:
                return EvidenceAgreementClassification.MIXED_AGREEMENT;

            case 2:
                return EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE;

            default:
                throw new Error(
                    `Unreachable: accessControlDifference must be 0, 1, or 2; got ${result.accessControlDifference}`,
                );
        }
    }
}