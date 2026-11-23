import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ListingPriceDto {
  @IsInt()
  @Min(0)
  amountKobo!: number;

  @IsString()
  currency!: string;

  @IsEnum(['MONTHLY', 'YEARLY', 'TOTAL'])
  period!: 'MONTHLY' | 'YEARLY' | 'TOTAL';

  @IsOptional()
  @IsInt()
  @Min(1)
  years?: number;
}

export class ListingFeeDto {
  @IsEnum(['LEGAL', 'CAUTION', 'SERVICE_CHARGE', 'AGENCY', 'INSPECTION_FEE', 'OTHER'])
  type!: 'LEGAL' | 'CAUTION' | 'SERVICE_CHARGE' | 'AGENCY' | 'INSPECTION_FEE' | 'OTHER';

  @IsInt()
  @Min(0)
  amountKobo!: number;

  @IsString()
  currency!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateListingDto {
  @IsEnum(['RENT', 'SALE'])
  kind!: 'RENT' | 'SALE';

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  displayLocation!: string;

  // Property: attach to existing, OR create new. Exactly one must be provided.
  @IsOptional()
  @IsString()
  propertyId?: string;

  @IsOptional()
  @IsString()
  propertyType?:
    | 'ESTATE'
    | 'COMPOUND'
    | 'BUILDING'
    | 'HOUSE'
    | 'APARTMENT'
    | 'HOSTEL'
    | 'UNIT'
    | 'SHOP'
    | 'OFFICE'
    | 'WAREHOUSE'
    | 'LAND';

  @IsOptional()
  @IsString()
  countryId?: string;

  @IsOptional()
  @IsString()
  stateId?: string;

  @IsOptional()
  @IsString()
  placeId?: string;

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

  @IsOptional()
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  sizeSqm?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ValidateNested()
  @Type(() => ListingPriceDto)
  price!: ListingPriceDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ListingFeeDto)
  fees?: ListingFeeDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaIds?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  expiresInDays?: number;
}