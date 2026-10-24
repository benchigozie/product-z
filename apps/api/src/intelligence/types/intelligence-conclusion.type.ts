import type { IntelligenceConfidence } from '../enums/intelligence-confidence.enum.js';
import type { ConclusionState } from '../enums/conclusion-state.enum.js';

export interface IntelligenceConclusion {
    conclusion: ConclusionState;
    confidence: IntelligenceConfidence;
    reason: string;
    reasonSignals: string[];
    evidenceReferences: string[];
    considerations: string[];
}