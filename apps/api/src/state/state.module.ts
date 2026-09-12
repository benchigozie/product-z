import { Module } from '@nestjs/common';

import { StateController } from './state.controller.js';
import { StateRepository } from './state.repository.js';
import { StateService } from './state.service.js';

@Module({
  controllers: [StateController],
  providers: [StateRepository, StateService],
  exports: [StateRepository, StateService],
})
export class StateModule {}