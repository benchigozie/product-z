
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsString,
    IsUUID,
} from 'class-validator';

import { IntelligenceConfidence } from '../enums/intelligence-confidence.enum.js';
import { PowerCondition } from '../enums/power-condition.enum.js';

export class IntelligenceConclusionDto {
    @IsEnum(PowerCondition)
    conclusion!: PowerCondition;

    @IsEnum(IntelligenceConfidence)
    confidence!: IntelligenceConfidence;

    @IsString()
    reason!: string;

    @IsArray()
    @IsString({ each: true })
    reasonSignals!: string[];

    @IsArray()
    @IsString({ each: true })
    evidenceReferences: string[];

    @IsArray()
    @IsString({ each: true })
    considerations!: string[];
}
