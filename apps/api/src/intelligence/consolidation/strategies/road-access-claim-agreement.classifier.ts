import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';
import type { RoadAccessClaimAgreementResult } from '../types/road-access-claim-agreement.type.js';

@Injectable()
export class RoadAccessClaimAgreementClassifier {
    classify(
        agreement: RoadAccessClaimAgreementResult,
    ): EvidenceAgreementClassification {
        switch (agreement.accessibilityDifference) {
            case 0:
                return EvidenceAgreementClassification.STRONG_AGREEMENT;

            case 1:
                return EvidenceAgreementClassification.MIXED_AGREEMENT;

            case 2:
            case 3:
                return EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE;

            default:
                throw new Error(
                    `Unexpected accessibility difference: ${agreement.accessibilityDifference}`,
                );
        }
    }
}