import contract from '../prisma/contract.json' with { type: 'json' };

import type { FieldInputTypes } from '../prisma/contract.d';

export const PROPERTY_TYPES =
  contract.domain.namespaces.public.enum.PropertyType.members.map(
    (member) => member.value,
  );

type PropertyType =
  FieldInputTypes['public']['Property']['propertyType'];

export const PROPERTY_CONTAINMENT_RULES: Record<
  PropertyType,
  readonly PropertyType[]
> = {
  ESTATE: ['COMPOUND', 'BUILDING', 'HOUSE', 'LAND'],
  COMPOUND: ['BUILDING', 'HOUSE', 'HOSTEL', 'SHOP'],
  BUILDING: ['APARTMENT', 'UNIT', 'OFFICE', 'SHOP', 'HOSTEL'],
  HOUSE: ['APARTMENT'],
  HOSTEL: ['UNIT'],
  APARTMENT: [],
  UNIT: [],
  SHOP: [],
  OFFICE: [],
  WAREHOUSE: [],
  LAND: [],
};

export function canContainPropertyType(
  parentType: PropertyType,
  childType: PropertyType,
): boolean {
  return PROPERTY_CONTAINMENT_RULES[parentType].includes(childType);
}