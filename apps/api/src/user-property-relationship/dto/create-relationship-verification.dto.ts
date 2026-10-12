import { IsEnum, IsOptional } from 'class-validator';

import { RelationshipVerificationMethod } from '../enums/relationship-verification-method.enum.js';

export type RelationshipVerificationEvidence =
  | string
  | number
  | boolean
  | null
  | RelationshipVerificationEvidence[]
  | { [key: string]: RelationshipVerificationEvidence };

export class CreateRelationshipVerificationDto {
  @IsEnum(RelationshipVerificationMethod)
  method: RelationshipVerificationMethod;

  @IsOptional()
  evidence?: RelationshipVerificationEvidence;
}