import { Module } from '@nestjs/common';

import { CountryController } from './country.controller.js';
import { CountryRepository } from './country.repository.js';
import { CountryService } from './country.service.js';

@Module({
  controllers: [CountryController],
  providers: [CountryRepository, CountryService],
  exports: [CountryRepository, CountryService],
})
export class CountryModule {}