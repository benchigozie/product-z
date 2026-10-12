import type { IntelligenceConfidence } from '../enums/intelligence-confidence.enum.js';

export interface IntelligenceConclusion {
    conclusion: string;
    confidence: IntelligenceConfidence;
    reason: string;
    reasonSignals: string[];
    evidenceReferences: string[];
    considerations: string[];
}