import {
    IsArray,
    IsEnum,
    IsOptional,
  } from 'class-validator';
  
  import { SecurityAccessControl } from '../../types/security/security-access-control.type.js';
  import { SecurityFeature } from '../../types/security/security-feature.type.js';
  import { SecurityPersonnel } from '../../types/security/security-personnel.type.js';
  
  export class SecurityDataDto {
    @IsOptional()
    @IsEnum(SecurityAccessControl)
    accessControl?: SecurityAccessControl;
  
    @IsOptional()
    @IsEnum(SecurityPersonnel)
    personnel?: SecurityPersonnel;
  
    @IsOptional()
    @IsArray()
    @IsEnum(SecurityFeature, { each: true })
    features?: SecurityFeature[];
  }