import type { EvidenceAgreementClassification } from "../evidence-agreement.classification";
import type { AgreementResult } from "../agreement-result.type";

export interface PowerAgreementAnalysis {
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: AgreementResult;
}