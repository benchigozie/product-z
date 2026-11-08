import type { RoadAccessAgreementResult } from './road-access-agreement.type.js';
import type { EvidenceAgreementClassification } from '../evidence-agreement.classification.js';

export interface RoadAccessAgreementAnalysis {
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: RoadAccessAgreementResult;
}