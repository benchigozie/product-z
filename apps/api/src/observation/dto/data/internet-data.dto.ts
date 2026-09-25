import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  import { Availability } from '../../types/common/availability.type.js';
  import { Reliability } from '../../types/common/reliability.type.js';
  import { Coverage } from '../../types/internet/coverage.type.js';
  import { InternetConnectionType } from '../../types/internet/internet-connection-type.type.js';
  
  export class InternetDataDto {
    @IsString()
    @IsNotEmpty()
    provider: string;
  
    @IsEnum(InternetConnectionType)
    connectionType: InternetConnectionType;
  
    @IsEnum(Availability)
    availability: Availability;
  
    @IsOptional()
    @IsEnum(Reliability)
    reliability?: Reliability;
  
    @IsOptional()
    @IsEnum(Coverage)
    coverage?: Coverage;
  }