import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';
import type { FloodingClaimAgreementResult } from '../types/flooding-claim-agreement.type.js';

@Injectable()
export class FloodingClaimAgreementClassifier {
    classify(
        agreement: FloodingClaimAgreementResult,
    ): EvidenceAgreementClassification {
        switch (agreement.occurrenceDifference) {
            case 0:
                return EvidenceAgreementClassification.STRONG_AGREEMENT;

            case 1:
                return EvidenceAgreementClassification.MIXED_AGREEMENT;

            case 2:
                return EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE;

            default:
                throw new Error(
                    `Unexpected occurrence difference: ${agreement.occurrenceDifference}`,
                );
        }
    }
}