import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';
import type { PowerClaimAgreementResult } from '../types/power-claim-agreement.js';

@Injectable()
export class PowerClaimAgreementClassifier {
    classify(
        agreement: PowerClaimAgreementResult,
    ): EvidenceAgreementClassification {
        if (!agreement.sourceMatch) {
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