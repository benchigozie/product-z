import type { FieldInputTypes } from '../../prisma/contract.d';

import {
  IsIn,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { PROPERTY_RELATIONSHIP_TYPES } from '../property-relationship-types.js';

type PropertyRelationshipType =
  FieldInputTypes[
    'public'
  ]['PropertyRelationship']['relationshipType'];

export class CreatePropertyRelationshipDto {
  @IsString()
  @IsNotEmpty()
  parentPropertyId!: string;

  @IsString()
  @IsNotEmpty()
  childPropertyId!: string;

  @IsIn(PROPERTY_RELATIONSHIP_TYPES)
  relationshipType!: PropertyRelationshipType;
}