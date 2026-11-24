import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ListingRepository } from './listing.repository.js';

@Injectable()
export class ListingExpiryScheduler {
  private readonly logger = new Logger(ListingExpiryScheduler.name);

  constructor(private readonly repo: ListingRepository) {}

  @Cron(CronExpression.EVERY_HOUR)
  async expireListings() {
    const now = new Date();
    const expired = await this.repo.findExpiredActiveListings(now);

    if (expired.length === 0) return;

    this.logger.log(`Expiring ${expired.length} listings`);

    for (const listing of expired) {
      await this.repo.updateStatus(listing.id, 'EXPIRED');
    }
  }
}