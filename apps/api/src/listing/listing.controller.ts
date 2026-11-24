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
}