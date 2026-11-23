import { Module } from '@nestjs/common';

import { MatchSuggestionController } from './match-suggestion.controller.js';
import { MatchSuggestionService } from './match-suggestion.service.js';
import { MatchRepository } from './match.repository.js';
import { UserModule } from '../user/user.module.js';
import { PropertyModule } from '../property/property.module.js';
import { SessionModule } from '../session/session.module.js';

@Module({
  imports: [UserModule, PropertyModule, SessionModule],
  controllers: [MatchSuggestionController],
  providers: [MatchSuggestionService, MatchRepository],
  exports: [MatchSuggestionService],
})
export class MatchModule {}