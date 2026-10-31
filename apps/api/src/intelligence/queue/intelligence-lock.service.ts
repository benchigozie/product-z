import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type Redis from 'ioredis';

import { INTELLIGENCE_LOCK_TTL_SECONDS } from './intelligence-recompute.constants.js';

export const INTELLIGENCE_REDIS = Symbol('INTELLIGENCE_REDIS');

@Injectable()
export class IntelligenceLockService {
    private readonly logger = new Logger(IntelligenceLockService.name);

    constructor(
        @Inject(INTELLIGENCE_REDIS)
        private readonly redis: Redis,
    ) {}

    async withPropertyLock<T>(
        propertyId: string,
        fn: () => Promise<T>,
    ): Promise<T> {
        const key = `intelligence:prop:${propertyId}:lock`;
        const token = randomUUID();

        const acquired = await this.redis.set(
            key,
            token,
            'EX',
            INTELLIGENCE_LOCK_TTL_SECONDS,
            'NX',
        );

        if (acquired !== 'OK') {
            throw new Error(
                `Intelligence lock for property ${propertyId} is held by another job.`,
            );
        }

        try {
            return await fn();
        } finally {
            const current = await this.redis.get(key);
            if (current === token) {
                await this.redis.del(key);
            }
        }
    }

    async withPlaceLock<T>(
        placeId: string,
        fn: () => Promise<T>,
    ): Promise<T> {
        const key = `intelligence:place:${placeId}:lock`;
        const token = randomUUID();

        const acquired = await this.redis.set(
            key,
            token,
            'EX',
            INTELLIGENCE_LOCK_TTL_SECONDS,
            'NX',
        );

        if (acquired !== 'OK') {
            throw new Error(
                `Intelligence lock for place ${placeId} is held by another job.`,
            );
        }

        try {
            return await fn();
        } finally {
            const current = await this.redis.get(key);
            if (current === token) {
                await this.redis.del(key);
            }
        }
    }
}