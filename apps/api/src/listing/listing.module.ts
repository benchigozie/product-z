import { Module } from '@nestjs/common';

import { ListingController } from './listing.controller.js';
import { ListingService } from './listing.service.js';
import { ListingRepository } from './listing.repository.js';
import { SessionModule } from '../session/session.module.js';
import { MatchModule } from '../match/match.module.js';

@Module({
  imports: [SessionModule, MatchModule],
  controllers: [ListingController],
  providers: [ListingService, ListingRepository],
  exports: [ListingService],
})
export class ListingModule {}