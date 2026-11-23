import type { UserRole } from '../auth/decorators/roles.decorator.js';

/**
 * The role a user held *at the time they acted* on a suggestion.
 * Derived from User.role (OPS/ADMIN) OR from a VERIFIED UserPropertyRelationship
 * on one of the two properties involved. Snapshot into the suggestion row so the
 * audit trail reflects what they were when they acted, not what they are now.
 *
 * Kept as a string union here rather than importing the contract's valueSet —
 * identical values, simpler type surface, and it keeps this module from
 * depending on the contract's enum gymnastics.
 */
export type MatchActorRole =
  | 'CREATOR'
  | 'AGENT'
  | 'LANDLORD'
  | 'TENANT'
  | 'OPS'
  | 'ADMIN';

export type ActorSide = 'SOURCE' | 'CANDIDATE' | 'BOTH' | 'NEITHER';

export type ActorOnSuggestion = {
  userId: string;
  side: ActorSide;
  role: MatchActorRole | null;
  /**
   * True if the actor's confirmation alone is enough to merge.
   * Landlord (verified) and OPS/ADMIN are authoritative.
   * Creator, AGENT, TENANT, RESIDENT are not — they need the other side's confirm.
   */
  isAuthoritative: boolean;
};

export type ResolveActorInput = {
  userId: string;
  userRole: UserRole;
  suggestion: {
    sourceProperty: { id: string; createdByUserId: string | null };
    candidateProperty: { id: string; createdByUserId: string | null };
  };
  /**
   * Callback provided by the caller so this function stays pure.
   * Returns true iff the user has a VERIFIED UserPropertyRelationship of the given
   * type on the given property. The caller (MatchSuggestionService) supplies a
   * lookup that hits the DB — this function never does I/O itself.
   */
  hasVerifiedRelationship: (
    propertyId: string,
    type: 'LANDLORD' | 'TENANT' | 'RESIDENT' | 'AGENT',
  ) => boolean;
};

/**
 * Determine which side of the suggestion the caller is on, what role they
 * held, and whether their confirmation is authoritative.
 *
 * Precedence (highest first):
 *   1. OPS/ADMIN           → side BOTH, authoritative
 *   2. Verified LANDLORD   → side on the matching property (BOTH if both), authoritative
 *   3. createdByUserId     → side on the matching property (BOTH if both), non-authoritative
 *   4. Verified TENANT/RESIDENT/AGENT → side on the matching property, non-authoritative
 *   5. Otherwise           → NEITHER
 *
 * Unverified relationships do not count. A user who *claims* to be a landlord
 * without a VERIFIED RelationshipVerification is just a creator if they created
 * one of the properties, and NEITHER otherwise.
 */
export function resolveActor(input: ResolveActorInput): ActorOnSuggestion {
  const { userId, userRole, suggestion, hasVerifiedRelationship } = input;
  const { sourceProperty, candidateProperty } = suggestion;

  // 1. Team roles — always BOTH and authoritative.
  if (userRole === 'OPS' || userRole === 'ADMIN') {
    return {
      userId,
      side: 'BOTH',
      role: userRole,
      isAuthoritative: true,
    };
  }

  // 2. Verified landlord — authoritative on whichever side they hold it.
  const landlordOnSource = hasVerifiedRelationship(sourceProperty.id, 'LANDLORD');
  const landlordOnCandidate = hasVerifiedRelationship(candidateProperty.id, 'LANDLORD');

  if (landlordOnSource && landlordOnCandidate) {
    return { userId, side: 'BOTH', role: 'LANDLORD', isAuthoritative: true };
  }
  if (landlordOnSource) {
    return { userId, side: 'SOURCE', role: 'LANDLORD', isAuthoritative: true };
  }
  if (landlordOnCandidate) {
    return { userId, side: 'CANDIDATE', role: 'LANDLORD', isAuthoritative: true };
  }

  // 3. Creator of either property — non-authoritative.
  const createdSource = sourceProperty.createdByUserId === userId;
  const createdCandidate = candidateProperty.createdByUserId === userId;

  if (createdSource && createdCandidate) {
    return { userId, side: 'BOTH', role: 'CREATOR', isAuthoritative: false };
  }
  if (createdSource) {
    return { userId, side: 'SOURCE', role: 'CREATOR', isAuthoritative: false };
  }
  if (createdCandidate) {
    return { userId, side: 'CANDIDATE', role: 'CREATOR', isAuthoritative: false };
  }

  // 4. Verified tenant / resident / agent — non-authoritative.
  // Precedence order among these when multiple hold: AGENT > TENANT > RESIDENT.
  // Rationale: agent carries more authority for "I know what this property is"
  // than tenant, which carries more than resident. In practice, the same person
  // rarely holds multiple, but we need a deterministic answer when they do.
  const rolesToCheck: Array<{ type: 'AGENT' | 'TENANT' | 'RESIDENT'; role: MatchActorRole }> = [
    { type: 'AGENT', role: 'AGENT' },
    { type: 'TENANT', role: 'TENANT' },
    { type: 'RESIDENT', role: 'TENANT' }, // resident is a kind of tenant for our purposes
  ];

  for (const { type, role } of rolesToCheck) {
    const onSource = hasVerifiedRelationship(sourceProperty.id, type);
    const onCandidate = hasVerifiedRelationship(candidateProperty.id, type);

    if (onSource && onCandidate) {
      return { userId, side: 'BOTH', role, isAuthoritative: false };
    }
    if (onSource) {
      return { userId, side: 'SOURCE', role, isAuthoritative: false };
    }
    if (onCandidate) {
      return { userId, side: 'CANDIDATE', role, isAuthoritative: false };
    }
  }

  // 5. Nobody — not a party to either property.
  return { userId, side: 'NEITHER', role: null, isAuthoritative: false };
}