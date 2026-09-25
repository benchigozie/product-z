import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
    IsOptional,
  } from 'class-validator';
  
  import { Availability } from '../../types/common/availability.type.js';
  import { Reliability } from '../../types/common/reliability.type.js';
  import { PowerSource } from '../../types/power/power-data.type.js';
  
  export class PowerDataDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(PowerSource, { each: true })
    source: PowerSource[];
  
    @IsEnum(Availability)
    availability: Availability;
  
    @IsOptional()
    @IsEnum(Reliability)
    reliability?: Reliability;
  }