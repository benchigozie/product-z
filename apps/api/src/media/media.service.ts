import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { randomUUID } from 'node:crypto';
  
  import { MediaRepository } from './media.repository.js';
  import type { PresignMediaDto } from './dto/presign-media.dto.js';
  import type { ConfirmMediaDto } from './dto/confirm-media.dto.js';
  import {
    STORAGE_SERVICE,
    type StorageService,
  } from './storage/storage.service.js';
  
  const MIME_TO_EXT: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  
  @Injectable()
  export class MediaService {
    constructor(
      private readonly repo: MediaRepository,
      @Inject(STORAGE_SERVICE) private readonly storage: StorageService,
    ) {}
  
    async presign(userId: string, dto: PresignMediaDto) {
      const ext = MIME_TO_EXT[dto.contentType];
      if (!ext) {
        throw new BadRequestException('Unsupported content type');
      }
  
      const folder = dto.purpose === 'LISTING_PHOTO' ? 'listings' : 'properties';
      const key = `${folder}/${userId}/${randomUUID()}${ext}`;
  
      const presigned = await this.storage.presignPut({
        key,
        contentType: dto.contentType,
        expiresInSeconds: 600,
      });
  
      const media = await this.repo.createPending({
        storageKey: presigned.storageKey,
        url: presigned.publicUrl,
        mime: dto.contentType,
        size: dto.sizeBytes,
        purpose: dto.purpose,
        createdByUserId: userId,
      });
  
      return {
        mediaId: media.id,
        uploadUrl: presigned.uploadUrl,
        publicUrl: presigned.publicUrl,
        storageKey: presigned.storageKey,
        expiresInSeconds: 600,
      };
    }
  
    async confirm(userId: string, dto: ConfirmMediaDto) {
      const media = await this.repo.findById(dto.mediaId);
      if (!media) {
        throw new NotFoundException('Media not found');
      }
      if (media.createdByUserId !== userId) {
        throw new ForbiddenException('Not your media');
      }
  
      if (media.status === 'READY') {
        return media;
      }
  
      return this.repo.markReady(media.id);
    }
  
    async delete(userId: string, mediaId: string) {
      const media = await this.repo.findById(mediaId);
      if (!media) {
        throw new NotFoundException('Media not found');
      }
      if (media.createdByUserId !== userId) {
        throw new ForbiddenException('Not your media');
      }
  
      await this.storage.deleteObject(media.storageKey);
      await this.repo.deleteById(mediaId);
  
      return { success: true };
    }
  }