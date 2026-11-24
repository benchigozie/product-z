import {
    Body,
    Controller,
    Param,
    Post,
    UseGuards,
  } from '@nestjs/common';
  
  import { OpsService } from './ops.service.js';
  import { SessionAuthGuard } from '../auth/guards/session-auth.guard.js';
  import { RolesGuard } from '../auth/guards/roles.guard.js';
  import { Roles } from '../auth/decorators/roles.decorator.js';
  import {
    CurrentUser,
    type SessionUser,
  } from '../auth/decorators/current-user.decorator.js';
  import { MergePropertiesDto } from './dto/merge-properties.dto.js';
  
  @Controller('ops')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('OPS', 'ADMIN')
  export class OpsController {
    constructor(private readonly opsService: OpsService) {}
  
    @Post('properties/merge')
    merge(
      @CurrentUser() user: SessionUser,
      @Body() dto: MergePropertiesDto,
    ) {
      return this.opsService.mergeProperties({
        sourceId: dto.sourceId,
        targetId: dto.targetId,
        actorId: user.id,
        reason: dto.reason,
      });
    }
  
    @Post('properties/merges/:mergeId/reverse')
    reverse(
      @CurrentUser() user: SessionUser,
      @Param('mergeId') mergeId: string,
    ) {
      return this.opsService.reverseMerge({
        mergeId,
        actorId: user.id,
      });
    }
  }