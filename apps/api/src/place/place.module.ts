import { Module } from '@nestjs/common';

import { PlaceController } from './place.controller.js';
import { PlaceRepository } from './place.repository.js';
import { PlaceService } from './place.service.js';

@Module({
  controllers: [PlaceController],
  providers: [PlaceRepository, PlaceService],
  exports: [PlaceRepository, PlaceService],
})
export class PlaceModule {}