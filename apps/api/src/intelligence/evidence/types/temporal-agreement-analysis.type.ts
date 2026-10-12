
import type { EvidenceAgreementClassification } from '../evidence-agreement.classification.js';

export enum TemporalAgreementInterpretation {
    CONSISTENT = 'CONSISTENT',
    POSSIBLE_CHANGE = 'POSSIBLE_CHANGE',
    UNRESOLVED_DISAGREEMENT = 'UNRESOLVED_DISAGREEMENT',
}

export interface TemporalAgreementAnalysis {
    firstObservationId: string;
    secondObservationId: string;
    agreementClassification: EvidenceAgreementClassification;
    interpretation: TemporalAgreementInterpretation;
    timeDifferenceInDays: number;
}
