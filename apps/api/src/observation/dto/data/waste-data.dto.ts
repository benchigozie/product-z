import {
    IsEnum,
    IsOptional,
  } from 'class-validator';
  
  import { WasteCollection } from '../../types/waste/waste-collection.type.js';
  import { WasteCondition } from '../../types/waste/waste-condition.type.js';
  
  export class WasteDataDto {
    @IsOptional()
    @IsEnum(WasteCondition)
    condition?: WasteCondition;
  
    @IsOptional()
    @IsEnum(WasteCollection)
    collection?: WasteCollection;
  }