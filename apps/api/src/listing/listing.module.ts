import { Module } from '@nestjs/common';

import { ListingController } from './listing.controller.js';
import { ListingService } from './listing.service.js';
import { ListingRepository } from './listing.repository.js';
import { SessionModule } from '../session/session.module.js';
import { MatchModule } from '../match/match.module.js';
import { ListingExpiryScheduler } from './listing-expiry.scheduler.js';
import { AuthModule } from '../auth/auth.module.js';

import { UserModule } from '../user/user.module.js';


@Module({
  imports: [SessionModule, MatchModule, AuthModule, UserModule],
  controllers: [ListingController],
  providers: [ListingService, ListingRepository, ListingExpiryScheduler],
  exports: [ListingService],
})
export class ListingModule {}

