import type { ObservationCategory } from '../../../observation/enums/observation-category.enum.js';

export interface ParsedObservation {
    category: ObservationCategory;
    data: Record<string, unknown>;
    description: string;
}

export interface ObservationIngestionOutput {
    observations: ParsedObservation[];
}

export interface ObservationIngestionResult {
    observations: ParsedObservation[];
    rejected: Array<{
        category: ObservationCategory;
        reason: string;
        raw: unknown;
    }>;
}