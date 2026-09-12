import { Injectable } from '@nestjs/common';
import type { StateResult } from './types/state-result.type.js';
import { StateRepository } from './state.repository.js';

@Injectable()
export class StateService {
  constructor(
    private readonly stateRepository: StateRepository,
  ) {}

  async findAll() {
    return this.stateRepository.findAll();
  }

  async findById(id: string): Promise<StateResult> {
    return this.stateRepository.findById(id);
  }

  async findByCountryId(countryId: string) : Promise<StateResult[]> {
    return this.stateRepository.findByCountryId(countryId);
  }
}