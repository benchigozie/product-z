import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsOptional,
  } from 'class-validator';
  
  import { Availability } from '../../types/common/availability.type.js';
  import { Reliability } from '../../types/common/reliability.type.js';
  import { WaterSource } from '../../types/water/water-source.type.js';
  
  export class WaterDataDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(WaterSource, { each: true })
    source: WaterSource[];
  
    @IsEnum(Availability)
    availability: Availability;
  
    @IsOptional()
    @IsEnum(Reliability)
    reliability?: Reliability;
  }