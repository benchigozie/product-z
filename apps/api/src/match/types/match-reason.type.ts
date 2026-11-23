
export type MatchReason =
  | { type: 'DISTANCE';  meters: number; weight: number }
  | { type: 'ADDRESS';   similarity: number; weight: number }
  | { type: 'LANDMARK';  similarity: number; weight: number }
  | { type: 'TYPE';      same: boolean; weight: number }
  | { type: 'STATE';     same: boolean; weight: number }
  | { type: 'PLACE';     same: boolean; weight: number };

export type MatchReasonType = MatchReason['type'];