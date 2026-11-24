import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import type { PropertyType } from '../types/listing-result.type.js';

export class BrowseListingsDto {
  @IsOptional() @IsString() stateId?: string;
  @IsOptional() @IsString() placeId?: string;
  @IsOptional() @IsEnum(['RENT', 'SALE']) kind?: 'RENT' | 'SALE';

  @IsOptional()
  @IsEnum([
    'ESTATE', 'COMPOUND', 'BUILDING', 'HOUSE', 'APARTMENT',
    'HOSTEL', 'UNIT', 'SHOP', 'OFFICE', 'WAREHOUSE', 'LAND',
  ])
  propertyType?: PropertyType;

  @IsOptional() @Type(() => Number) @IsInt() @Min(0) bedrooms?: number;

  @IsOptional() @IsString() q?: string;

  @IsOptional()
  @IsEnum(['newest'])
  sort?: 'newest';

  @IsOptional() @IsString() cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}