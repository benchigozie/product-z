export interface PresignPutResult {
    uploadUrl: string;
    storageKey: string;
    publicUrl: string;
  }
  
  export interface StorageService {
    presignPut(params: {
      key: string;
      contentType: string;
      expiresInSeconds?: number;
    }): Promise<PresignPutResult>;
  
    deleteObject(key: string): Promise<void>;
  
    getPublicUrl(key: string): string;
  }
  
  export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');