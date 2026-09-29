import {
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';

import { UserPropertyRelationshipType } from '../enums/user-property-relationship-type.enum.js';
import { RelationshipDatePrecision } from '../enums/relationship-date-precision.enum.js';
import { IsValidRelationshipDates } from '../validators/is-valid-relationship-dates.validator.js';

export class CreateUserPropertyRelationshipDto {
  @IsEnum(UserPropertyRelationshipType)
  relationshipType: UserPropertyRelationshipType;

  @IsDateString()
  startedAt: string;

  @IsEnum(RelationshipDatePrecision)
  startedAtPrecision: RelationshipDatePrecision;

  @IsOptional()
  @IsDateString()
  @IsValidRelationshipDates({
    message: 'endedAt must be greater than or equal to startedAt',
  })
  endedAt?: string;

  @IsOptional()
  @IsEnum(RelationshipDatePrecision)
  endedAtPrecision?: RelationshipDatePrecision;
}