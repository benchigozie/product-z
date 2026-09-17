import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';

import { SessionRepository } from './session.repository.js';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SessionService {
    private readonly sessionDuration = 1000 * 60 * 60 * 24 * 30;

    constructor(
        private readonly sessionRepository: SessionRepository,
    ) { }

    async createSession(userId: string) {
        const token = this.generateToken();

        const tokenHash = this.hashToken(token);

        const expiresAt = new Date(
            Date.now() + this.sessionDuration,
          );

        const session =
            await this.sessionRepository.create({
                userId,
                tokenHash,
                expiresAt,
            });

        return {
            session,
            token,
        };
    }

    async validateSession(token: string) {
        const tokenHash = crypto.createHash('sha256') 
            .update(token)
            .digest('hex');

        const session =
            await this.sessionRepository.findByTokenHash(tokenHash);

        if (!session) {
            throw new UnauthorizedException('Invalid session');
        }

        if (session.expiresAt < new Date()) {
            throw new UnauthorizedException('Session expired');
          }
        return session;
    }

    async revokeSession(sessionId: string) {
        return this.sessionRepository.delete(sessionId);
      }

    private generateToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    private hashToken(token: string): string {
        return crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
    }

    
}