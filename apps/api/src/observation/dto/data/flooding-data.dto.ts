import {
    IsEnum,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  import { Severity } from '../../types/common/severity.type.js';
  import { FloodingExtent } from '../../types/flooding/floodind-extent.type.js';
  import { FloodingOccurrence } from '../../types/flooding/flooding-occurence.type.js';
  
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