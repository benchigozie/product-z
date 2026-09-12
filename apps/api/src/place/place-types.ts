import contract from '../prisma/contract.json' with { type: 'json' };

export const PLACE_TYPES =
  contract.domain.namespaces.public.enum.PlaceType.members.map(
    (member) => member.value,
  );