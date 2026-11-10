import type { BuildingConditionAgreementResult } from './building-condition-agreement.type.js';
import type { EvidenceAgreementClassification } from '../evidence-agreement.classification.js';

export interface BuildingConditionAgreementAnalysis {
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: BuildingConditionAgreementResult;
}