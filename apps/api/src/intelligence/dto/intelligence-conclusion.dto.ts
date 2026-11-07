import {
    IsArray,
    IsEnum,
    IsIn,
    IsString,
} from 'class-validator';

import { IntelligenceConfidence } from '../enums/intelligence-confidence.enum.js';
import { PowerCondition } from '../enums/power-condition.enum.js';
import { FloodingCondition } from '../enums/flooding-condition.enum.js';
import { SecurityCondition } from '../enums/security-condition.enum.js';

import { WaterCondition } from '../enums/water-condition.enum.js';

import { InternetCondition } from '../enums/internet-condition.enum.js';
import { SanitationConclusion } from '../enums/sanitation-conclusion.enum.js';

const VALID_CONCLUSIONS: readonly string[] = [
    ...Object.values(PowerCondition),
    ...Object.values(WaterCondition),
    ...Object.values(FloodingCondition),
    ...Object.values(SecurityCondition),
    ...Object.values(InternetCondition),
    ...Object.values(SanitationConclusion),
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