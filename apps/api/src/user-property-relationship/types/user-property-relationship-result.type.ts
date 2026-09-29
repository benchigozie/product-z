export type UserPropertyRelationshipResult = {
    id: string;
  
    userId: string;
    propertyId: string;
  
    relationshipType: string;
  
    startedAt: string;
    startedAtPrecision: string;
  
    endedAt: string | null;
    endedAtPrecision: string | null;
  
    createdAt: Date;
    updatedAt: Date;
  };
  
  export type UserPropertyRelationshipListResult =
    UserPropertyRelationshipResult[];