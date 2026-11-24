import { Module } from '@nestjs/common';

import { ListingController } from './listing.controller.js';
import { ListingService } from './listing.service.js';
import { ListingRepository } from './listing.repository.js';
import { SessionModule } from '../session/session.module.js';
import { MatchModule } from '../match/match.module.js';
import { ListingExpiryScheduler } from './listing-expiry.scheduler.js';

@Module({
  imports: [SessionModule, MatchModule],
  controllers: [ListingController],
  providers: [ListingService, ListingRepository, ListingExpiryScheduler],
  exports: [ListingService],
})
export class ListingModule {}

