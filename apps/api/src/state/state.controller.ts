import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { StateService } from './state.service.js';
import type { StateListResult, StateResult } from './types/state-result.type.js';

@Controller('states')
export class StateController {
  constructor(
    private readonly stateService: StateService,
  ) {}

  @Get()
  async findAll(@Query('countryId') countryId?: string) : Promise<StateListResult> {
    if (countryId) {
      return this.stateService.findByCountryId(countryId);
    }

    return this.stateService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) : Promise<StateResult> {
    return this.stateService.findById(id);
  }
}