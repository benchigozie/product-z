import {
    IsEnum,
    IsOptional,
  } from 'class-validator';
  
  import { DrainageBlockage } from '../../types/drainage/drainage-blockage.type.js';
  import { DrainageCondition } from '../../types/drainage/drainage-condition.type.js';
  
  export class DrainageDataDto {
    @IsEnum(DrainageCondition)
    condition: DrainageCondition;
  
    @IsOptional()
    @IsEnum(DrainageBlockage)
    blockage?: DrainageBlockage;
  }