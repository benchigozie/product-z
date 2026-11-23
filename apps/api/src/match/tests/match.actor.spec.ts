import { describe, expect, it } from 'vitest';
import { resolveActor, type ResolveActorInput } from '../match.actor.js';

const SOURCE_ID = 'prop-source';
const CANDIDATE_ID = 'prop-candidate';
const USER_ID = 'user-1';

function makeInput(
  overrides: Partial<ResolveActorInput> = {},
  relationshipOverride: (propertyId: string, type: string) => boolean = () => false,
): ResolveActorInput {
  return {
    userId: USER_ID,
    userRole: 'USER',
    suggestion: {
      sourceProperty: { id: SOURCE_ID, createdByUserId: null },
      candidateProperty: { id: CANDIDATE_ID, createdByUserId: null },
    },
    hasVerifiedRelationship: relationshipOverride,
    ...overrides,
  };
}

describe('resolveActor', () => {
  it('OPS → BOTH, authoritative', () => {
    const a = resolveActor(makeInput({ userRole: 'OPS' }));
    expect(a.side).toBe('BOTH');
    expect(a.role).toBe('OPS');
    expect(a.isAuthoritative).toBe(true);
  });

  it('ADMIN → BOTH, authoritative', () => {
    const a = resolveActor(makeInput({ userRole: 'ADMIN' }));
    expect(a.side).toBe('BOTH');
    expect(a.role).toBe('ADMIN');
    expect(a.isAuthoritative).toBe(true);
  });

  it('verified landlord on source → SOURCE, authoritative', () => {
    const a = resolveActor(
      makeInput({}, (id, type) => id === SOURCE_ID && type === 'LANDLORD'),
    );
    expect(a.side).toBe('SOURCE');
    expect(a.role).toBe('LANDLORD');
    expect(a.isAuthoritative).toBe(true);
  });

  it('verified landlord on candidate → CANDIDATE, authoritative', () => {
    const a = resolveActor(
      makeInput({}, (id, type) => id === CANDIDATE_ID && type === 'LANDLORD'),
    );
    expect(a.side).toBe('CANDIDATE');
    expect(a.role).toBe('LANDLORD');
    expect(a.isAuthoritative).toBe(true);
  });

  it('verified landlord on both → BOTH, authoritative', () => {
    const a = resolveActor(
      makeInput({}, (_id, type) => type === 'LANDLORD'),
    );
    expect(a.side).toBe('BOTH');
    expect(a.role).toBe('LANDLORD');
    expect(a.isAuthoritative).toBe(true);
  });

  it('UNVERIFIED landlord does not count — falls through', () => {
    // hasVerifiedRelationship returns false for everything, even though
    // the caller might know they're a landlord.
    const a = resolveActor(makeInput({}, () => false));
    expect(a.role).toBeNull();
    expect(a.side).toBe('NEITHER');
    expect(a.isAuthoritative).toBe(false);
  });

  it('creator of source → SOURCE, non-authoritative', () => {
    const a = resolveActor(
      makeInput({
        suggestion: {
          sourceProperty: { id: SOURCE_ID, createdByUserId: USER_ID },
          candidateProperty: { id: CANDIDATE_ID, createdByUserId: 'someone-else' },
        },
      }),
    );
    expect(a.side).toBe('SOURCE');
    expect(a.role).toBe('CREATOR');
    expect(a.isAuthoritative).toBe(false);
  });

  it('creator of candidate → CANDIDATE, non-authoritative', () => {
    const a = resolveActor(
      makeInput({
        suggestion: {
          sourceProperty: { id: SOURCE_ID, createdByUserId: 'someone-else' },
          candidateProperty: { id: CANDIDATE_ID, createdByUserId: USER_ID },
        },
      }),
    );
    expect(a.side).toBe('CANDIDATE');
    expect(a.role).toBe('CREATOR');
    expect(a.isAuthoritative).toBe(false);
  });

  it('creator of both → BOTH, non-authoritative', () => {
    const a = resolveActor(
      makeInput({
        suggestion: {
          sourceProperty: { id: SOURCE_ID, createdByUserId: USER_ID },
          candidateProperty: { id: CANDIDATE_ID, createdByUserId: USER_ID },
        },
      }),
    );
    expect(a.side).toBe('BOTH');
    expect(a.role).toBe('CREATOR');
    expect(a.isAuthoritative).toBe(false);
  });

  it('verified tenant on source → SOURCE, non-authoritative', () => {
    const a = resolveActor(
      makeInput({}, (id, type) => id === SOURCE_ID && type === 'TENANT'),
    );
    expect(a.side).toBe('SOURCE');
    expect(a.role).toBe('TENANT');
    expect(a.isAuthoritative).toBe(false);
  });

  it('verified agent beats verified tenant when both hold', () => {
    const a = resolveActor(
      makeInput({}, (id, type) => id === SOURCE_ID && (type === 'AGENT' || type === 'TENANT')),
    );
    expect(a.role).toBe('AGENT');
  });

  it('verified AGENT on source → SOURCE, non-authoritative', () => {
    const a = resolveActor(
      makeInput({}, (id, type) => id === SOURCE_ID && type === 'AGENT'),
    );
    expect(a.side).toBe('SOURCE');
    expect(a.role).toBe('AGENT');
    expect(a.isAuthoritative).toBe(false);
  });

  it('landlord outranks creator when both apply', () => {
    // User created the source AND is verified landlord on candidate.
    // Landlord precedence wins.
    const a = resolveActor(
      makeInput(
        {
          suggestion: {
            sourceProperty: { id: SOURCE_ID, createdByUserId: USER_ID },
            candidateProperty: { id: CANDIDATE_ID, createdByUserId: 'someone-else' },
          },
        },
        (id, type) => id === CANDIDATE_ID && type === 'LANDLORD',
      ),
    );
    expect(a.role).toBe('LANDLORD');
    expect(a.side).toBe('CANDIDATE');
    expect(a.isAuthoritative).toBe(true);
  });

  it('stranger (no relationship, no creation) → NEITHER', () => {
    const a = resolveActor(
      makeInput({
        suggestion: {
          sourceProperty: { id: SOURCE_ID, createdByUserId: 'someone-else' },
          candidateProperty: { id: CANDIDATE_ID, createdByUserId: 'another-person' },
        },
      }),
    );
    expect(a.side).toBe('NEITHER');
    expect(a.role).toBeNull();
    expect(a.isAuthoritative).toBe(false);
  });
});