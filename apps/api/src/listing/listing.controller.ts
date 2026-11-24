import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ListingService } from './listing.service.js';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard.js';
import {
  CurrentUser,
  type SessionUser,
} from '../auth/decorators/current-user.decorator.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { ListingDetail } from './types/listing-result.type.js';

import { BrowseListingsDto } from './dto/browse-listings.dto.js';
import type { ListingBrowseResult } from './types/listing-result.type.js';

import { Req } from '@nestjs/common';
import type { Request } from 'express';
import { CreateReferralDto } from './dto/create-referral.dto.js';

import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { FlagListingDto } from './dto/flag-listing.dto.js';



@Controller('listings')
export class ListingController {
  constructor(private readonly listingService: ListingService) { }

  // ---------- Property search (dedup) ----------

  @Get('properties/search')
  @UseGuards(SessionAuthGuard)
  searchProperties(
    @Query('stateId') stateId: string,
    @Query('q') q: string,
  ) {
    if (!stateId || !q) {
      return { candidates: [] };
    }
    return this.listingService.searchProperties({ stateId, q });
  }

  // ---------- Create ----------

  @Post()
  @UseGuards(SessionAuthGuard)
  create(@CurrentUser() user: SessionUser, @Body() dto: CreateListingDto) {
    return this.listingService.create(user.id, dto);
  }

  // ---------- Read ----------

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.listingService.getById(id);
  }

  // ---------- Update ----------

  @Patch(':id')
  @UseGuards(SessionAuthGuard)
  update(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingService.update(user.id, id, dto);
  }

  @Post(':id/publish')
  @UseGuards(SessionAuthGuard)
  publish(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
  ): Promise<ListingDetail> {
    return this.listingService.publish(user.id, id);
  }

  @Post(':id/pause')
  @UseGuards(SessionAuthGuard)
  pause(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
  ): Promise<ListingDetail> {
    return this.listingService.pause(user.id, id);
  }

  @Post(':id/activate')
  @UseGuards(SessionAuthGuard)
  activate(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
  ): Promise<ListingDetail> {
    return this.listingService.activate(user.id, id);
  }

  @Post(':id/withdraw')
  @UseGuards(SessionAuthGuard)
  withdraw(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
  ): Promise<ListingDetail> {
    return this.listingService.withdraw(user.id, id);
  }

  @Post(':id/fill')
  @UseGuards(SessionAuthGuard)
  markFilled(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
  ): Promise<ListingDetail> {
    return this.listingService.markFilled(user.id, id);
  }

  @Get()
  browse(@Query() dto: BrowseListingsDto): Promise<ListingBrowseResult> {
    return this.listingService.browse(dto);
  }

  @Post(':id/referral')
  recordReferral(
    @Param('id') id: string,
    @Body() dto: CreateReferralDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as { id: string } | undefined)?.id;
    const anonymousId = (req.cookies as Record<string, string> | undefined)
      ?.pz_anon_id;
    const sessionId = (req.cookies as Record<string, string> | undefined)
      ?.session
      ? undefined
      : undefined;

    return this.listingService.recordReferral({
      listingId: id,
      userId,
      anonymousId,
      sessionId,
    });
  }

  @Post(':id/flag')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('OPS', 'ADMIN')
  flag(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
    @Body() dto: FlagListingDto,
  ): Promise<ListingDetail> {
    return this.listingService.flag(user.id, id, dto.reason);
  }

  @Post(':id/approve')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('OPS', 'ADMIN')
  approve(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
  ): Promise<ListingDetail> {
    return this.listingService.approve(user.id, id);
  }

  @Post(':id/reject')
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles('OPS', 'ADMIN')
  reject(
    @CurrentUser() user: SessionUser,
    @Param('id') id: string,
  ): Promise<ListingDetail> {
    return this.listingService.reject(user.id, id);
  }

}