import type { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';

export interface WaterClaimAgreementAnalysis {
    firstClaimId: string;
    secondClaimId: string;
    classification: EvidenceAgreementClassification;
    availabilityDifference: number;
    sharedObservationIds: string[];
    firstObservationIds: string[];
    secondObservationIds: string[];
    timeDifferenceInDays: number;
}