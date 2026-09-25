import {
    IsEnum,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  import { ConstructionImpact } from '../../types/construction/construction-impact.type.js';
  import { ConstructionStatus } from '../../types/construction/construction-status.type.js';
  
  export class ConstructionDataDto {
    @IsEnum(ConstructionStatus)
    status: ConstructionStatus;
  
    @IsOptional()
    @IsEnum(ConstructionImpact)
    impact?: ConstructionImpact;
  
    @IsOptional()
    @IsString()
    description?: string;
  }