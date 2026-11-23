import { Module } from '@nestjs/common';

import { MediaController } from './media.controller.js';
import { MediaService } from './media.service.js';
import { MediaRepository } from './media.repository.js';
import { StorageModule } from './storage/storage.module.js';

import { AuthModule } from '../auth/auth.module.js';
import { SessionModule } from '../session/session.module.js';

@Module({
  imports: [StorageModule, AuthModule, SessionModule],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository],
  exports: [MediaService],
})
export class MediaModule {}