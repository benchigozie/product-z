import { Injectable, NotFoundException } from '@nestjs/common';
import type { CountryResult } from './types/country-result.type.ts';

import { CountryRepository } from './country.repository.js';

@Injectable()
export class CountryService {
  constructor(
    private readonly countryRepository: CountryRepository,
  ) {}

  async findAll() {
    return this.countryRepository.findAll();
  }

  async findById(id: string) : Promise<CountryResult> {
    const country = await this.countryRepository.findById(id);

    if (!country) {
      throw new NotFoundException(`Country not found`);
    }

    return country;
  }
}