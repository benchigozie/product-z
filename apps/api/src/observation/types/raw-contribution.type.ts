export interface RawContribution {
    id: string;
    text: string;
    submittedAt: string;
    submitterId: string | null;
    submitterDisplayName: string | null;
    submitterRelationship: string | null;
}