import type { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';

export interface SanitationClaimAgreementAnalysis {
    firstClaimId: string;
    secondClaimId: string;
    classification: EvidenceAgreementClassification;
    conditionDifference: number;
    sharedObservationIds: string[];
    firstObservationIds: string[];
    secondObservationIds: string[];
    timeDifferenceInDays: number;
}