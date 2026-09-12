import type { FieldInputTypes } from '../prisma/contract.d';

type PlaceType = FieldInputTypes['public']['Place']['type'];

export const PLACE_PARENT_TYPES: Record<
  PlaceType,
  readonly PlaceType[]
> = {
  DISTRICT: [],
  SUBDISTRICT: ['DISTRICT'],
  AREA: ['DISTRICT', 'SUBDISTRICT'],
};

