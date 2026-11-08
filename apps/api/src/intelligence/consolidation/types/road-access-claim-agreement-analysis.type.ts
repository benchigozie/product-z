import type { EvidenceAgreementClassification } from '../../evidence/evidence-agreement.classification.js';

export interface RoadAccessClaimAgreementAnalysis {
    firstClaimId: string;
    secondClaimId: string;
    classification: EvidenceAgreementClassification;
    accessibilityDifference: number;
    sharedObservationIds: string[];
    firstObservationIds: string[];
    secondObservationIds: string[];
    timeDifferenceInDays: number;
}