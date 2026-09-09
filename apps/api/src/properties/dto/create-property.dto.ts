import type { FieldInputTypes } from '../../prisma/contract.d';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { PROPERTY_TYPES } from '../property-types.js';

type PropertyType =
    FieldInputTypes['public']['Property']['propertyType'];

export class CreatePropertyDto {
    @IsIn(PROPERTY_TYPES)
    propertyType!: PropertyType;
    @IsString()
    @IsNotEmpty()
    countryId!: string;
    @IsString()
    @IsNotEmpty()
    stateId!: string;
    @IsString()
    @IsNotEmpty()
    area!: string;
    name?: string;
    city?: string;
    address?: string;
    landmark?: string;
    latitude?: number;
    longitude?: number;
}