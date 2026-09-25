import {
    IsEnum,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  import { SanitationCondition } from '../../types/sanitation/sanitation-condition.type.js';
  
  export class SanitationDataDto {
    @IsEnum(SanitationCondition)
    condition: SanitationCondition;
  
    @IsOptional()
    @IsString()
    description?: string;
  }