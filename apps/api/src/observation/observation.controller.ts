import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
    Req,
} from '@nestjs/common';

import type { Request } from 'express';

import { CreateObservationDto } from './dto/create-observation.dto.js';
import { ObservationService } from './observation.service.js';
import type { ObservationResult, ObservationListResult } from './types/observation-result.type.js';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard.js';

@Controller('observations')
export class ObservationController {
    constructor(
        private readonly observationService: ObservationService,
    ) { }

    @Post()
    @UseGuards(SessionAuthGuard)
    async create(
      @Req() request: Request,
      @Body() dto: CreateObservationDto,
    ) {
      return this.observationService.create(
        dto,
        request.user!.id,
      );
    }

    @Get('property/:propertyId')
    async findByPropertyId(
        @Param('propertyId') propertyId: string,
    ): Promise<ObservationListResult> {
        return this.observationService.findByPropertyId(propertyId);
    }

    @Get('place/:placeId')
    async findByPlaceId(
        @Param('placeId') placeId: string,
    ): Promise<ObservationListResult> {
        return this.observationService.findByPlaceId(placeId);
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<ObservationResult> {
        return this.observationService.findById(id);
    }
}