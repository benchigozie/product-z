import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { SessionAuthGuard } from '../auth/guards/session-auth.guard.js';
import { CreateTextObservationDto } from './dto/create-text-observation.dto.js';
import { ObservationService } from './observation.service.js';

@Controller('observations')
export class ObservationTextController {
    constructor(
        private readonly observationService: ObservationService,
    ) {}

    @Post('text')
    @UseGuards(SessionAuthGuard)
    async createFromText(
        @Req() request: Request,
        @Body() dto: CreateTextObservationDto,
    ) {
        return this.observationService.createFromText(
            dto,
            request.user!.id,
        );
    }
}