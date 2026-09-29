import {
    Body,
    Controller,
    Param,
    Post,
    Get,
    Req,
    UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';

import { SessionAuthGuard } from '../auth/guards/session-auth.guard.js';
import { CreateUserPropertyRelationshipDto } from './dto/create-user-property-relationsjip.dto.js';
import { UserPropertyRelationshipService } from './user-property-relationship.service.js';

@Controller('properties/:propertyId/relationships')
@UseGuards(SessionAuthGuard)
export class UserPropertyRelationshipController {
    constructor(
        private readonly relationshipService: UserPropertyRelationshipService,
    ) { }

    @Get()
    async findByPropertyId(
        @Param('propertyId') propertyId: string,
    ) {
        return this.relationshipService.findByPropertyId(propertyId);
    }

    @Post()
    async create(
        @Param('propertyId') propertyId: string,
        @Body() data: CreateUserPropertyRelationshipDto,
        @Req() request: Request,
    ) {
        return this.relationshipService.create(
            propertyId,
            request.user!.id,
            data,
        );
    }

    @Get('me')
    async findMyRelationships(
        @Req() request: Request,
    ) {
        return this.relationshipService.findByUserId(request.user!.id);
    }
}