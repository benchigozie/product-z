import { Injectable } from '@nestjs/common';

import { FloodingOccurrence } from '../../../observation/types/flooding/flooding-occurrence.type.js';
import type { FloodingClaimData } from '../types/flooding-claim-data.type.js';
import type { FloodingClaimAgreementResult } from '../types/flooding-claim-agreement.type.js';

@Injectable()
export class FloodingClaimAgreementService {
    compare(
        first: FloodingClaimData,
        second: FloodingClaimData,
    ): FloodingClaimAgreementResult {
        const occurrenceDifference = Math.abs(
            this.occurrenceValue(first.occurrence) -
            this.occurrenceValue(second.occurrence),
        );

        return {
            occurrenceDifference,
        };
    }

    private occurrenceValue(occurrence: FloodingOccurrence): number {
        switch (occurrence) {
            case FloodingOccurrence.NO_FLOODING_OBSERVED:
                return 0;
            case FloodingOccurrence.EVIDENCE_OF_PAST_FLOODING:
                return 1;
            case FloodingOccurrence.FLOODING_OBSERVED:
                return 2;
        }
    }
}