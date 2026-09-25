import {
    IsEnum,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  import { ParkingAvailability } from '../../types/parking/parking-availability.type.js';
  
  export class ParkingDataDto {
    @IsEnum(ParkingAvailability)
    availability: ParkingAvailability;
  
    @IsOptional()
    @IsString()
    description?: string;
  }