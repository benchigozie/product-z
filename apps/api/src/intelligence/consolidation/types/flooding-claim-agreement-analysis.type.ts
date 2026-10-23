import type { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';

export interface FloodingClaimAgreementAnalysis {
    firstClaimId: string;
    secondClaimId: string;
    classification: EvidenceAgreementClassification;
    occurrenceDifference: number;
    sharedObservationIds: string[];
    firstObservationIds: string[];
    secondObservationIds: string[];
    timeDifferenceInDays: number;
}