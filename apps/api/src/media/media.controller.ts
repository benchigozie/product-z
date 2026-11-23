import {
    Body,
    Controller,
    Delete,
    Param,
    Post,
    UseGuards,
  } from '@nestjs/common';
  
  import { MediaService } from './media.service.js';
  import { SessionAuthGuard } from '../auth/guards/session-auth.guard.js';
  import {
    CurrentUser,
    type SessionUser,
  } from '../auth/decorators/current-user.decorator.js';
  import { PresignMediaDto } from './dto/presign-media.dto.js';
  import { ConfirmMediaDto } from './dto/confirm-media.dto.js';
  
  @Controller('media')
  @UseGuards(SessionAuthGuard)
  export class MediaController {
    constructor(private readonly mediaService: MediaService) {}
  
    @Post('presign')
    presign(@CurrentUser() user: SessionUser, @Body() dto: PresignMediaDto) {
      return this.mediaService.presign(user.id, dto);
    }
  
    @Post('confirm')
    confirm(@CurrentUser() user: SessionUser, @Body() dto: ConfirmMediaDto) {
      return this.mediaService.confirm(user.id, dto);
    }
  
    @Delete(':id')
    delete(@CurrentUser() user: SessionUser, @Param('id') id: string) {
      return this.mediaService.delete(user.id, id);
    }
  }