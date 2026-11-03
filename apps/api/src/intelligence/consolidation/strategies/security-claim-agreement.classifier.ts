import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';
import type { SecurityClaimAgreementResult } from '../types/security-claim-agreement.type.js';

@Injectable()
export class SecurityClaimAgreementClassifier {
    classify(
        agreement: SecurityClaimAgreementResult,
    ): EvidenceAgreementClassification {
        if (agreement.accessControlDifference === -1) {
            return EvidenceAgreementClassification.NOT_COMPARABLE;
        }

        switch (agreement.accessControlDifference) {
            case 0:
                return EvidenceAgreementClassification.STRONG_AGREEMENT;

            case 1:
                return EvidenceAgreementClassification.MIXED_AGREEMENT;

            case 2:
                return EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE;

            default:
                throw new Error(
                    `Unexpected accessControlDifference: ${agreement.accessControlDifference}`,
                );
        }
    }
}