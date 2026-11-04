import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';
import type { InternetClaimAgreementResult } from '../types/internet-claim-agreement.type.js';

@Injectable()
export class InternetClaimAgreementClassifier {
    classify(
        agreement: InternetClaimAgreementResult,
    ): EvidenceAgreementClassification {
        if (!agreement.connectionTypeMatch) {
            return EvidenceAgreementClassification.NOT_COMPARABLE;
        }

        switch (agreement.availabilityDifference) {
            case 0:
                return EvidenceAgreementClassification.STRONG_AGREEMENT;

            case 1:
                return EvidenceAgreementClassification.MIXED_AGREEMENT;

            case 2:
                return EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE;

            default:
                throw new Error(
                    `Unexpected availability difference: ${agreement.availabilityDifference}`,
                );
        }
    }
}