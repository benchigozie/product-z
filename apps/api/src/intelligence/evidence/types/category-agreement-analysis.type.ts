import type { EvidenceAgreementClassification } from '../evidence-agreement.classification.js';
import type { AgreementResult } from '../agreement-result.type.js';
import type { FloodingAgreementResult } from './flooding-agreement.type.js';
import { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';
import type { SecurityAgreementResult } from './security-agreement.type.js';
import type { SanitationAgreementResult } from './sanitation-agreement.type.js';
import type { RoadAccessAgreementResult } from './road-access-agreement.type.js';


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

export interface SecurityCategoryAgreementAnalysis {
    category: ObservationCategory.SECURITY;
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: SecurityAgreementResult;
}


export interface InternetCategoryAgreementAnalysis {
    category: ObservationCategory.INTERNET;
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: AgreementResult;
}


export interface SanitationCategoryAgreementAnalysis {
    category: ObservationCategory.SANITATION;
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: SanitationAgreementResult;
}


export interface RoadAccessCategoryAgreementAnalysis {
    category: ObservationCategory.ROAD_ACCESS;
    firstObservationId: string;
    secondObservationId: string;
    classification: EvidenceAgreementClassification;
    timeDifferenceInDays: number;
    agreement: RoadAccessAgreementResult;
}

export type CategoryAgreementAnalysis =
    | PowerCategoryAgreementAnalysis
    | WaterCategoryAgreementAnalysis
    | FloodingCategoryAgreementAnalysis
    | SecurityCategoryAgreementAnalysis
    | InternetCategoryAgreementAnalysis
    | SanitationCategoryAgreementAnalysis
    | RoadAccessCategoryAgreementAnalysis;