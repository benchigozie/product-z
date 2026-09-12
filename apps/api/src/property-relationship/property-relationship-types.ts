import contract from '../prisma/contract.json' with { type: 'json' };

export const PROPERTY_RELATIONSHIP_TYPES =
  contract.domain.namespaces.public.enum.PropertyRelationshipType.members.map(
    (member) => member.value,
  );