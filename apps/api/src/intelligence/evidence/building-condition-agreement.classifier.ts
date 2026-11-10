import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from './evidence-agreement.classification.js';
import type { BuildingConditionAgreementResult } from './types/building-condition-agreement.type.js';

@Injectable()
export class BuildingConditionAgreementClassifier {
    classify(
        result: BuildingConditionAgreementResult,
    ): EvidenceAgreementClassification {
        switch (result.conditionDifference) {
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
                    `Unreachable: conditionDifference must be 0-4; got ${result.conditionDifference}`,
                );
        }
    }
}