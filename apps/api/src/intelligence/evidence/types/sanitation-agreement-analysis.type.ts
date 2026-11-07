import type { SanitationAgreementResult } from './sanitation-agreement.type.js';
import type { EvidenceAgreementClassification } from '../evidence-agreement.classification.js';

export interface SanitationAgreementAnalysis {
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: SanitationAgreementResult;
}