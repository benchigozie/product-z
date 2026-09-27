import { Module } from '@nestjs/common';

import { ObservationController } from './observation.controller.js';
import { ObservationRepository } from './observation.repository.js';
import { ObservationService } from './observation.service.js';

import { SessionModule } from '../session/session.module.js';

@Module({
  imports: [SessionModule],

  controllers: [ObservationController],

  providers: [
    ObservationRepository,
    ObservationService,
  ],
})
export class ObservationModule {}