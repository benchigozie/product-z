export type IntelligenceTarget =
    | {
        type: 'PROPERTY';
        propertyId: string;
    }
    | {
        type: 'PLACE';
        placeId: string;
    };