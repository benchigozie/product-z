import type { AgreementResult } from '../agreement-result.type.js';
import type { EvidenceAgreementClassification } from '../evidence-agreement.classification.js';

export interface InternetAgreementAnalysis {
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: AgreementResult;
}