import { Module } from '@nestjs/common';
import { SessionService } from './session.service.js';
import { SessionRepository } from './session.repository.js';

@Module({
    imports: [],
    providers: [
      SessionService,
      SessionRepository,
    ],
    exports: [
      SessionService,
    ],
  })
  export class SessionModule {}