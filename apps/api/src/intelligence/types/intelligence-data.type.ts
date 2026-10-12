import type { ObservationCategory } from "../../observation/enums/observation-category.enum";

export enum IntelligenceConfidence {
    LOW = 'LOW',
    MODERATE = 'MODERATE',
    HIGH = 'HIGH',
}

export enum IntelligenceReasonSignal {
    LIMITED_EVIDENCE = 'LIMITED_EVIDENCE',
    RECENT_EVIDENCE = 'RECENT_EVIDENCE',
    OLD_EVIDENCE = 'OLD_EVIDENCE',

    MULTIPLE_REPORTS = 'MULTIPLE_REPORTS',
    STRONG_AGREEMENT = 'STRONG_AGREEMENT',
    MIXED_AGREEMENT = 'MIXED_AGREEMENT',
    CONTRADICTORY_EVIDENCE = 'CONTRADICTORY_EVIDENCE',

    CHANGING_CONDITIONS = 'CHANGING_CONDITIONS',
    RELEVANT_CONTEXT = 'RELEVANT_CONTEXT',
}

export interface CategoryIntelligence {
    conclusion: string;
    confidence: IntelligenceConfidence;
    reason: string;
    reasonSignals: IntelligenceReasonSignal[];
    evidenceReferences: string[];
}

export type IntelligenceCategoryMap = Partial<
    Record<ObservationCategory, CategoryIntelligence>
>;

export interface OverallIntelligence {
    understanding: string;
    confidence: IntelligenceConfidence;
    reason: string;
    evidenceReferences: string[];
}

export interface IntelligenceData {
    categories: IntelligenceCategoryMap;
    overall: OverallIntelligence;
    considerations: string[];
}