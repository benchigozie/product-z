import {
    IsEnum,
    IsOptional,
  } from 'class-validator';
  
  import { BuildingComponent } from '../../types/building-condition/building-component.type.js';
  import { BuildingCondition } from '../../types/building-condition/building-condition.type.js';
  import { BuildingIssue } from '../../types/building-condition/building-issue.type.js';
  
  export class BuildingConditionDataDto {
    @IsEnum(BuildingComponent)
    component: BuildingComponent;
  
    @IsEnum(BuildingCondition)
    condition: BuildingCondition;
  
    @IsOptional()
    @IsEnum(BuildingIssue)
    issue?: BuildingIssue;
  }