import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
  } from '@nestjs/common';
  
  import { SessionAuthGuard } from '../auth/guards/session-auth.guard.js';
  import { CreateRelationshipVerificationDto } from './dto/create-relationship-verification.dto.js';
  import { RelationshipVerificationService } from './relationship-verification.service.js';
  import type {
    RelationshipVerificationListResult,
    RelationshipVerificationResult,
  } from './types/relationship-verification-result.type.js';
  
  @Controller('relationships/:relationshipId/verifications')
  @UseGuards(SessionAuthGuard)
  export class RelationshipVerificationController {
    constructor(
      private readonly verificationService: RelationshipVerificationService,
    ) {}
  
    @Post()
    async create(
      @Param('relationshipId') relationshipId: string,
      @Body() data: CreateRelationshipVerificationDto,
    ) {
      return this.verificationService.create(
        relationshipId,
        data,
      );
    }
  
    @Get()
    async findByRelationshipId(
      @Param('relationshipId') relationshipId: string,
    ): Promise<RelationshipVerificationListResult> {
      return this.verificationService.findByRelationshipId(
        relationshipId,
      );
    }
  
    @Get(':id')
    async findById(
      @Param('id') id: string,
    ): Promise<RelationshipVerificationResult | null> {
      return this.verificationService.findById(id);
    }
  }