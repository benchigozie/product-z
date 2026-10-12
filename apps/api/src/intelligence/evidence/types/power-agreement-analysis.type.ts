import type { EvidenceAgreementClassification } from "../evidence-agreement.classification";
import type { PowerAgreementResult } from "../power-agreement";

export interface PowerAgreementAnalysis {
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: PowerAgreementResult;
}