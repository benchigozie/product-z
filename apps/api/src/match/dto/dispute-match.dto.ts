// src/match/dto/dispute-match.dto.ts

import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Dispute body. `suspicious` defaults to true when omitted — an honest
 * "these are different properties" dispute can pass `suspicious: false`
 * to avoid filing a moderation Report; anything else flags for review.
 */
export class DisputeMatchDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;

  @IsOptional()
  @IsBoolean()
  suspicious?: boolean;
}