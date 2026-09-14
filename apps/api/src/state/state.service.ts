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

    const state = await this.stateRepository.findById(id);

    if (!state) {
      throw new Error(`State not found`);
    }

    return state;
  }

  async findByCountryId(countryId: string) : Promise<StateResult[]> {
    const state = await this.stateRepository.findByCountryId(countryId);

    if (!state) {
      throw new Error(`State not found`);
    }

    return state;
  }
}