import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class OtherDataDto {
  @IsString()
  @IsNotEmpty()
  subject: string;
}