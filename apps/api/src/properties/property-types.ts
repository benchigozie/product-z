import contract from '../prisma/contract.json' with { type: 'json' };

export const PROPERTY_TYPES =
  contract.domain.namespaces.public.enum.PropertyType.members.map(
    (member) => member.value,
  );