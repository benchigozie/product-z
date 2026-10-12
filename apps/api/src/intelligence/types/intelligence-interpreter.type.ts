import type { IntelligenceConclusion } from './intelligence-conclusion.type.js';

export interface IntelligenceInterpreter<TInput> {
    interpret(input: TInput): Promise<IntelligenceConclusion>;
}