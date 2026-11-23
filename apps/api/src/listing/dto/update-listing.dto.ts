import {
    IsArray,
    IsInt,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ListingFeeDto, ListingPriceDto } from './create-listing.dto.js';
  
  export class UpdateListingDto {
    @IsOptional() @IsString() title?: string;
    @IsOptional() @IsString() description?: string;
    @IsOptional() @IsString() displayLocation?: string;
    @IsOptional() @IsInt() @Min(0) bedrooms?: number;
    @IsOptional() @IsInt() @Min(0) bathrooms?: number;
    @IsOptional() @IsInt() @Min(0) sizeSqm?: number;
    @IsOptional() @IsArray() @IsString({ each: true }) features?: string[];
    @IsOptional() @IsInt() @Min(1) expiresInDays?: number;
  
    @IsOptional()
    @ValidateNested()
    @Type(() => ListingPriceDto)
    price?: ListingPriceDto;
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ListingFeeDto)
    fees?: ListingFeeDto[];
  }