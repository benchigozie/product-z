import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import type { SessionResult } from './types/session-result.type.js';


@Injectable()
export class SessionRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<SessionResult> {
    return this.prisma.db.orm.public.Session.create({
      userId: data.userId,
      tokenHash: data.tokenHash,
      expiresAt: Temporal.Instant.fromEpochMilliseconds(
        data.expiresAt.getTime(),
      ),
    });
  }

  async findByTokenHash(
    tokenHash: string,
  ): Promise<SessionResult | null> {
    const session = await this.prisma.db.orm.public.Session
      .where({ tokenHash })
      .first();
  
    if (!session) {
      return null;
    }
  
    return {
      ...session,
      expiresAt: new Date(session.expiresAt.epochMilliseconds),
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.db.orm.public.Session
      .where({ id })
      .delete();
  }
}