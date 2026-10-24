import type { EvidenceAgreementClassification } from '../evidence-agreement.classification.js';
import type { AgreementResult } from '../agreement-result.type.js';
import type { FloodingAgreementResult } from './flooding-agreement.type.js';
import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';

export interface PowerCategoryAgreementAnalysis {
    category: ObservationCategory.POWER;
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: AgreementResult;
}

export interface WaterCategoryAgreementAnalysis {
    category: ObservationCategory.WATER;
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: AgreementResult;
}

export interface FloodingCategoryAgreementAnalysis {
    category: ObservationCategory.FLOODING;
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: FloodingAgreementResult;
}

export type CategoryAgreementAnalysis =
    | PowerCategoryAgreementAnalysis
    | WaterCategoryAgreementAnalysis
    | FloodingCategoryAgreementAnalysis;