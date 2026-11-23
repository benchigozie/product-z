import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
export type MediaPurpose = 'PROPERTY_PHOTO' | 'LISTING_PHOTO';
export type MediaStatus = 'PENDING' | 'READY' | 'FAILED' | 'DELETED';

export type MediaRow = {
    id: string;
    storageKey: string;
    url: string;
    mime: string;
    size: number;
    width: number | null;
    height: number | null;
    durationSeconds: number | null;
    purpose: MediaPurpose;
    status: MediaStatus;
    createdByUserId: string | null;
    createdAt: Date;
    updatedAt: Date;
  };

@Injectable()
export class MediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPending(data: {
    storageKey: string;
    url: string;
    mime: string;
    size: number;
    purpose: MediaPurpose;
    createdByUserId: string;
  }): Promise<MediaRow> {
    return this.prisma.db.orm.public.Media.create(data) as Promise<MediaRow>;
  }

  async findById(id: string): Promise<MediaRow | null> {
    return this.prisma.db.orm.public.Media
      .where({ id })
      .first() as Promise<MediaRow | null>;
  }

  async markReady(id: string): Promise<MediaRow | null> {
    return this.prisma.db.orm.public.Media
      .where({ id })
      .update({ status: 'READY' }) as Promise<MediaRow | null>;
  }

  async markFailed(id: string): Promise<void> {
    await this.prisma.db.orm.public.Media
      .where({ id })
      .update({ status: 'FAILED' });
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.db.orm.public.Media.where({ id }).delete();
  }
}