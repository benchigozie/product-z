import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';
import type { SanitationClaimAgreementResult } from '../types/sanitation-claim-agreement.type.js';

@Injectable()
export class SanitationClaimAgreementClassifier {
    classify(
        agreement: SanitationClaimAgreementResult,
    ): EvidenceAgreementClassification {
        switch (agreement.conditionDifference) {
            case 0:
                return EvidenceAgreementClassification.STRONG_AGREEMENT;

            case 1:
                return EvidenceAgreementClassification.MIXED_AGREEMENT;

            case 2:
            case 3:
                return EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE;

            default:
                throw new Error(
                    `Unexpected condition difference: ${agreement.conditionDifference}`,
                );
        }
    }
}