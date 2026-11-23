import { IsString } from 'class-validator';

export class ConfirmMediaDto {
  @IsString()
  mediaId!: string;
}