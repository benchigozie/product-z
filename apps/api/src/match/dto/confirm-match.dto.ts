// src/match/dto/confirm-match.dto.ts

import { IsIn, IsOptional } from 'class-validator';

/**
 * Confirmation body. `side` is only required when the caller is on BOTH sides
 * of the suggestion — either as a creator of both properties, a verified
 * landlord of both, or an OPS/ADMIN who can confirm either side. For the
 * common case (creator of one side, or verified landlord of one side), the
 * service infers the side from the actor's role and this field is ignored.
 */
export class ConfirmMatchDto {
  @IsOptional()
  @IsIn(['SOURCE', 'CANDIDATE'])
  side?: 'SOURCE' | 'CANDIDATE';
}