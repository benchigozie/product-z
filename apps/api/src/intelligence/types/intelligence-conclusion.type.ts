import type { IntelligenceConfidence } from '../enums/intelligence-confidence.enum.js';
import type { PowerCondition } from '../enums/power-condition.enum.js';
import type { FloodingCondition } from '../enums/flooding-condition.enum.js';

export interface IntelligenceConclusion {
    conclusion: PowerCondition | FloodingCondition;
    confidence: IntelligenceConfidence;
    reason: string;
    reasonSignals: string[];
    evidenceReferences: string[];
    considerations: string[];
}