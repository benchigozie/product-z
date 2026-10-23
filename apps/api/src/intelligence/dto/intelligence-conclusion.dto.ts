import {
    IsArray,
    IsEnum,
    IsIn,
    IsString,
} from 'class-validator';

import { IntelligenceConfidence } from '../enums/intelligence-confidence.enum.js';
import { PowerCondition } from '../enums/power-condition.enum.js';
import { FloodingCondition } from '../enums/flooding-condition.enum.js';

const VALID_CONCLUSIONS: readonly string[] = [
    ...Object.values(PowerCondition),
    ...Object.values(FloodingCondition),
];

export class IntelligenceConclusionDto {
    @IsIn(VALID_CONCLUSIONS)
    conclusion!: string;

    @IsEnum(IntelligenceConfidence)
    confidence!: IntelligenceConfidence;

    @IsString()
    reason!: string;

    @IsArray()
    @IsString({ each: true })
    reasonSignals!: string[];

    @IsArray()
    @IsString({ each: true })
    evidenceReferences!: string[];

    @IsArray()
    @IsString({ each: true })
    considerations!: string[];
}