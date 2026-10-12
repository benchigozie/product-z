export interface ObservationClaimContext {
    timeframe?: string;
    frequency?: string;
    severity?: string;
    condition?: string;
}

export interface ObservationClaim {
    subject: string;
    value: string;
    context?: ObservationClaimContext;
}

export interface ObservationInterpretation {
    claims: ObservationClaim[];
    uncertainties: string[];
}