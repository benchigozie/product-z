import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { CreateObservationDto } from './dto/create-observation.dto.js';
import { ObservationRepository } from './observation.repository.js';
import type { ObservationResult, ObservationListResult } from './types/observation-result.type.js';

@Injectable()
export class ObservationService {
    constructor(
        private readonly observationRepository: ObservationRepository,
    ) { }

    async create(dto: CreateObservationDto) {
        const { propertyId, placeId } = dto;

        if (!propertyId && !placeId) {
            throw new BadRequestException(
                'An observation must target either a property or a place',
            );
        }

        if (propertyId && placeId) {
            throw new BadRequestException(
                'An observation cannot target both a property and a place',
            );
        }

        if (propertyId) {
            const property =
                await this.observationRepository.findPropertyById(propertyId);

            if (!property) {
                throw new NotFoundException(
                    `Property with id "${propertyId}" not found`,
                );
            }
        }

        if (placeId) {
            const place =
                await this.observationRepository.findPlaceById(placeId);

            if (!place) {
                throw new NotFoundException(
                    `Place with id "${placeId}" not found`,
                );
            }
        }

        return this.observationRepository.create(dto);
    }

    async findById(id: string): Promise<ObservationResult> {
        const observation = await this.observationRepository.findById(id);

        if (!observation) {
            throw new NotFoundException(`Observation not found`);
        }

        return observation;
    }

    async findByPropertyId(
        propertyId: string,
    ): Promise<ObservationListResult> {
        const property =
            await this.observationRepository.findPropertyById(propertyId);

        if (!property) {
            throw new NotFoundException(
                `Property with id "${propertyId}" not found`,
            );
        }

        return this.observationRepository.findByPropertyId(propertyId);
    }

    async findByPlaceId(
        placeId: string,
      ): Promise<ObservationListResult> {
        const place =
          await this.observationRepository.findPlaceById(placeId);
      
        if (!place) {
          throw new NotFoundException(
            `Place with id "${placeId}" not found`,
          );
        }
      
        return this.observationRepository.findByPlaceId(placeId);
      }
}