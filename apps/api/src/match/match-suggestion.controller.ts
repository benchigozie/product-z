// src/match/match-suggestion.controller.ts

import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
  } from '@nestjs/common';
  
  import { MatchSuggestionService } from './match-suggestion.service.js';
  import { SessionAuthGuard } from '../auth/guards/session-auth.guard.js';
  import {
    CurrentUser,
    type SessionUser,
  } from '../auth/decorators/current-user.decorator.js';
  import { ConfirmMatchDto } from './dto/confirm-match.dto.js';
  import { DisputeMatchDto } from './dto/dispute-match.dto.js';
  
  @Controller('match-suggestions')
  @UseGuards(SessionAuthGuard)
  export class MatchSuggestionController {
    constructor(
      private readonly matchSuggestionService: MatchSuggestionService,
    ) {}
  
    @Get()
    list(
      @CurrentUser() user: SessionUser,
      @Query('status') status?: string,
    ) {
      // Accept only the enum values; anything else is treated as "no filter".
      const allowed = [
        'PENDING',
        'PARTIALLY_CONFIRMED',
        'CONFIRMED',
        'DISPUTED',
        'EXPIRED',
      ] as const;
      type Status = (typeof allowed)[number];
      const filter: Status | undefined = (allowed as readonly string[]).includes(
        status ?? '',
      )
        ? (status as Status)
        : undefined;
  
      return this.matchSuggestionService.listForUser({
        userId: user.id,
        status: filter,
      });
    }
  
    @Get(':id')
    getById(
      @CurrentUser() user: SessionUser,
      @Param('id') id: string,
    ) {
      return this.matchSuggestionService.getByIdForUser({
        userId: user.id,
        id,
      });
    }
  
    @Post(':id/confirm')
    confirm(
      @CurrentUser() user: SessionUser,
      @Param('id') id: string,
      @Body() dto: ConfirmMatchDto,
    ) {
      return this.matchSuggestionService.confirm({
        userId: user.id,
        suggestionId: id,
        side: dto.side,
      });
    }
  
    @Post(':id/dispute')
    dispute(
      @CurrentUser() user: SessionUser,
      @Param('id') id: string,
      @Body() dto: DisputeMatchDto,
    ) {
      return this.matchSuggestionService.dispute({
        userId: user.id,
        suggestionId: id,
        reason: dto.reason,
        suspicious: dto.suspicious,
      });
    }
  }