import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';

import { SessionAuthGuard } from '../auth/guards/session-auth.guard.js';
import { VerificationReportService } from './verification-report.service.js';
import { CreateVerificationReportDto } from './dto/create-verification-report.dto.js';
import { UpdateVerificationReportStatusDto } from './dto/update-verification-report-status.dto.js';
import type { VerificationReportResult } from './types/verification-report-result.type.js';

@Controller('verification-reports')
export class VerificationReportController {
    constructor(
        private readonly verificationReportService: VerificationReportService,
    ) {}

    @Post()
    @UseGuards(SessionAuthGuard)
    async create(
        @Req() request: Request,
        @Body() dto: CreateVerificationReportDto,
    ): Promise<VerificationReportResult> {
        return this.verificationReportService.create(dto, request.user!.id);
    }

    @Get('property/:propertyId')
    async findPublishedByPropertyId(
        @Param('propertyId') propertyId: string,
    ): Promise<VerificationReportResult[]> {
        return this.verificationReportService.findPublishedByPropertyId(
            propertyId,
        );
    }

    @Get(':id')
    async findById(
        @Param('id') id: string,
    ): Promise<VerificationReportResult> {
        return this.verificationReportService.findById(id);
    }

    @Patch(':id/status')
    @UseGuards(SessionAuthGuard)
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateVerificationReportStatusDto,
    ): Promise<VerificationReportResult> {
        return this.verificationReportService.updateStatus(id, dto);
    }
}