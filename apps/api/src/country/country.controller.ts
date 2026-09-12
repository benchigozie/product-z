import {
    Controller,
    Get,
    Param,
  } from '@nestjs/common';
  
  import { CountryService } from './country.service.js';
    import type { CountryResult } from './types/country-result.type.ts';
  
  @Controller('countries')
  export class CountryController {
    constructor(
      private readonly countryService: CountryService,
    ) {}
  
    @Get()
    async findAll() {
      return this.countryService.findAll();
    }
  
    @Get(':id')
    async findById(@Param('id') id: string) : Promise<CountryResult> {
      return this.countryService.findById(id);
    }
  }