
import type { FieldInputTypes } from '../../prisma/contract.d';

import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsOptional()
  @IsString()
  placeId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  houseNumber?: string;

  @IsOptional()
  @IsString()
  unitIdentifier?: string;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
