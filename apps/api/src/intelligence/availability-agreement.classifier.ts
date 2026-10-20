// src/intelligence/evidence/availability-agreement.classifier.ts
import { Injectable } from '@nestjs/common';

import { EvidenceAgreementClassification } from './evidence/evidence-agreement.classification.js';
import type { AgreementResult } from './evidence/agreement-result.type';

@Injectable()
export class AvailabilityAgreementClassifier {
    classify(
        result: AgreementResult,
    ): EvidenceAgreementClassification {
        switch (result.availabilityDifference) {
            case 0:
                return EvidenceAgreementClassification.STRONG_AGREEMENT;

            case 1:
                return EvidenceAgreementClassification.MIXED_AGREEMENT;

            case 2:
                return EvidenceAgreementClassification.CONTRADICTORY_EVIDENCE;

            default:
                throw new Error(
                    `Unreachable: availabilityDifference must be 0, 1, or 2; got ${result.availabilityDifference}`,
                );
        }
    }
}