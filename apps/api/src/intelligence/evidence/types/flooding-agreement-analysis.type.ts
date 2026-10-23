import type { FloodingAgreementResult } from './flooding-agreement.type.js';
import type { EvidenceAgreementClassification } from '../evidence-agreement.classification.js';

export interface FloodingAgreementAnalysis {
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: FloodingAgreementResult;
}