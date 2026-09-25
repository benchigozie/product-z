import {
    IsEnum,
    IsISO8601,
    IsOptional,
    IsString,
} from 'class-validator';

import { ObservationCategory } from '../enums/observation-category.enum.js';
import { IsValidObservationData } from '../validators/observation-data.validator.js';
import { IsValidObservationTarget } from '../validators/observation-target.validator.js';


export class CreateObservationDto {
    @IsEnum(ObservationCategory)
    category: ObservationCategory;

    @IsOptional()
    @IsString()
    propertyId?: string;


    @IsOptional()
    @IsString()
    placeId?: string;

    @IsValidObservationTarget()
    private readonly targetValidation?: undefined;

    @IsValidObservationData()
    data?: unknown;


    @IsOptional()
    @IsString()
    description?: string;

    @IsISO8601()
    observedAt: string;
}