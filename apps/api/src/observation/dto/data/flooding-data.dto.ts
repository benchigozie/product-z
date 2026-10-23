import {
    IsEnum,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  import { Severity } from '../../types/common/severity.type.js';
  import { FloodingExtent } from '../../types/flooding/flooding-extent.type.js';
  import { FloodingOccurrence } from '../../types/flooding/flooding-occurrence.type.js';
  
  export class FloodingDataDto {
    @IsEnum(FloodingOccurrence)
    occurrence: FloodingOccurrence;
  
    @IsEnum(FloodingExtent)
    extent: FloodingExtent;
  
    @IsOptional()
    @IsEnum(Severity)
    severity?: Severity;
  
    @IsOptional()
    @IsString()
    conditions?: string;
  }