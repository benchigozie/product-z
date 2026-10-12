
import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsString,
    IsUUID,
} from 'class-validator';

import { IntelligenceConfidence } from '../enums/intelligence-confidence.enum.js';

export class IntelligenceConclusionDto {
    @IsString()
    conclusion!: string;

    @IsEnum(IntelligenceConfidence)
    confidence!: IntelligenceConfidence;

    @IsString()
    reason!: string;

    @IsArray()
    @IsString({ each: true })
    reasonSignals!: string[];

    @IsArray()
    @IsUUID(undefined, { each: true })
    evidenceReferences!: string[];

    @IsArray()
    @IsString({ each: true })
    considerations!: string[];
}
