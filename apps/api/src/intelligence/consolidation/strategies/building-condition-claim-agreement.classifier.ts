import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';
import type { BuildingConditionClaimAgreementResult } from '../types/building-condition-claim-agreement.type.js';

@Injectable()
export class BuildingConditionClaimAgreementClassifier {
    classify(
        agreement: BuildingConditionClaimAgreementResult,
    ): EvidenceAgreementClassification {
        switch (agreement.conditionDifference) {
            case 0:
                return EvidenceAgreementClassification.STRONG_AGREEMENT;

            case 1:
                return EvidenceAgreementClassification.MIXED_AGREEMENT;

            case 2:
            case 3:
            case 4:
                return EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE;

            default:
                throw new Error(
                    `Unexpected condition difference: ${agreement.conditionDifference}`,
                );
        }
    }
}