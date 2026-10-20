import type { IntelligenceConfidence } from '../enums/intelligence-confidence.enum.js';
import type { PowerCondition } from '../enums/power-condition.enum.js';

export interface IntelligenceConclusion {
    conclusion: PowerCondition;
    confidence: IntelligenceConfidence;
    reason: string;
    reasonSignals: string[];
    evidenceReferences: string[];
    considerations: string[];
}
