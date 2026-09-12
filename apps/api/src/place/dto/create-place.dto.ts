import type { FieldInputTypes } from '../../prisma/contract.d';

import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { PLACE_TYPES } from '../place-types.js';

type PlaceType =
  FieldInputTypes['public']['Place']['type'];

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn(PLACE_TYPES)
  type!: PlaceType;

  @IsString()
  @IsNotEmpty()
  stateId!: string;

  @IsOptional()
  @IsString()
  parentPlaceId?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}