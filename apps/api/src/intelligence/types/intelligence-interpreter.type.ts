import type { ValidatedConclusion } from './validated-conclusion.type.js';

export interface IntelligenceInterpreter<T> {
    interpret(input: T): Promise<ValidatedConclusion>;
}