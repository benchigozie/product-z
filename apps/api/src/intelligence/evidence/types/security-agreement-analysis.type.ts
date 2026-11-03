import type { SecurityAgreementResult } from './security-agreement.type.js';
import type { EvidenceAgreementClassification } from '../evidence-agreement.classification.js';

export interface SecurityAgreementAnalysis {
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: SecurityAgreementResult;
}