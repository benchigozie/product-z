import { IsOptional, IsString } from 'class-validator';

export class CreateReferralDto {
  @IsOptional() @IsString() sessionId?: string;
}