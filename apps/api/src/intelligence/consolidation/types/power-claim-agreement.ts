import type { PowerClaimData } from './power-claim-data.type.js';

export interface PowerClaimAgreementResult {
    sourceMatch: boolean;
    availabilityDifference: number;
}