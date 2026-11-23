import { describe, it, expect, vi, beforeEach } from 'vitest';

import { MediaService } from '../media.service.js';

describe('MediaService', () => {
  let service: MediaService;
  let repo: {
    createPending: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    markReady: ReturnType<typeof vi.fn>;
    markFailed: ReturnType<typeof vi.fn>;
    deleteById: ReturnType<typeof vi.fn>;
  };
  let storage: {
    presignPut: ReturnType<typeof vi.fn>;
    deleteObject: ReturnType<typeof vi.fn>;
    getPublicUrl: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    repo = {
      createPending: vi.fn(),
      findById: vi.fn(),
      markReady: vi.fn(),
      markFailed: vi.fn(),
      deleteById: vi.fn(),
    };
    storage = {
      presignPut: vi.fn(),
      deleteObject: vi.fn(),
      getPublicUrl: vi.fn(),
    };
    service = new MediaService(repo as any, storage as any);
  });

  it('presign returns upload url and creates pending media', async () => {
    storage.presignPut.mockResolvedValue({
      uploadUrl: 'https://upload',
      storageKey: 'listings/u1/x.jpg',
      publicUrl: 'https://public/listings/u1/x.jpg',
    });
    repo.createPending.mockResolvedValue({
      id: 'm1',
      status: 'PENDING',
      createdByUserId: 'u1',
    });

    const result = await service.presign('u1', {
      contentType: 'image/jpeg',
      sizeBytes: 1000,
      purpose: 'LISTING_PHOTO',
    });

    expect(result.mediaId).toBe('m1');
    expect(result.uploadUrl).toBe('https://upload');
    expect(repo.createPending).toHaveBeenCalledOnce();
  });

  it('confirm rejects non-owner', async () => {
    repo.findById.mockResolvedValue({
      id: 'm1',
      createdByUserId: 'u2',
      status: 'PENDING',
    });

    await expect(
      service.confirm('u1', { mediaId: 'm1' }),
    ).rejects.toThrow('Not your media');
  });

  it('delete removes storage object and DB row', async () => {
    repo.findById.mockResolvedValue({
      id: 'm1',
      storageKey: 'listings/u1/x.jpg',
      createdByUserId: 'u1',
    });

    await service.delete('u1', 'm1');

    expect(storage.deleteObject).toHaveBeenCalledWith('listings/u1/x.jpg');
    expect(repo.deleteById).toHaveBeenCalledWith('m1');
  });
});