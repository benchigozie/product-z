import { IsOptional, IsString } from 'class-validator';

export class MergePropertiesDto {
  @IsString() sourceId!: string;
  @IsString() targetId!: string;
  @IsOptional() @IsString() reason?: string;
}