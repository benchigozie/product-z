import { IsString } from 'class-validator';

export class PropertySearchDto {
  @IsString()
  q!: string;

  @IsString()
  stateId!: string;
}