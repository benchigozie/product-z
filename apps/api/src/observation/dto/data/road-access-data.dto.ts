import {
    ArrayNotEmpty,
    IsArray,
    IsEnum,
  } from 'class-validator';
  
  import { RoadAccessibility } from '../../types/road/road-accessibility.type.js';
  import { RoadCondition } from '../../types/road/road-condition.type.js';
  
  export class RoadAccessDataDto {
    @IsEnum(RoadCondition)
    condition: RoadCondition;
  
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(RoadAccessibility, { each: true })
    accessibility: RoadAccessibility[];
  }