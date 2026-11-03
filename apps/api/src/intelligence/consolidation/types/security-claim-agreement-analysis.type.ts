import type { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';

export interface SecurityClaimAgreementAnalysis {
    firstClaimId: string;
    secondClaimId: string;
    classification: EvidenceAgreementClassification;
    accessControlDifference: number;
    sharedObservationIds: string[];
    firstObservationIds: string[];
    secondObservationIds: string[];
    timeDifferenceInDays: number;
}