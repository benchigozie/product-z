import {
    BadRequestException,
    Injectable,
    Inject, 
    NotFoundException,
} from '@nestjs/common';

import { CreateObservationDto } from './dto/create-observation.dto.js';
import { ObservationRepository } from './observation.repository.js';
import type { ObservationResult, ObservationListResult } from './types/observation-result.type.js';
import {
    OBSERVATION_JOB_QUEUE,
    type ObservationJobQueue,
} from './jobs/observation-job-queue.interface.js';

import { ObservationIngestionService } from '../intelligence/ingestion/observation-ingestion.service.js';
import { CreateTextObservationDto } from './dto/create-text-observation.dto.js';

@Injectable()
export class ObservationService {
    constructor(
        private readonly observationRepository: ObservationRepository,
        @Inject(OBSERVATION_JOB_QUEUE)
        private readonly observationJobQueue: ObservationJobQueue,
        private readonly observationIngestionService: ObservationIngestionService,
    ) { }

    async create(
        dto: CreateObservationDto,
        userId: string,
      )  {
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

        const observation = await this.observationRepository.create(dto, userId);

        await this.observationJobQueue.addInterpretObservationJob({
            observationId: observation.id,
        });
        
        return observation;
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

      async createFromText(
        dto: CreateTextObservationDto,
        userId: string,
    ): Promise<{
        created: Array<{ id: string; category: string }>;
        rejected: Array<{ category: string; reason: string }>;
        unparsed: boolean;
        rawObservationId: string;
    }> {
        const { propertyId, placeId, text } = dto;
    
        if (!propertyId && !placeId) {
            throw new BadRequestException(
                'A text observation must target either a property or a place',
            );
        }
    
        if (propertyId && placeId) {
            throw new BadRequestException(
                'A text observation cannot target both a property and a place',
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
    
        const ingestion = await this.observationIngestionService.parse(text);
    
        const created: Array<{ id: string; category: string }> = [];
        const rejected: Array<{ category: string; reason: string }> = [];
    
        for (const observation of ingestion.observations) {
            try {
                const saved = await this.observationRepository.create(
                    {
                        category: observation.category,
                        propertyId,
                        placeId,
                        data: observation.data,
                        description: observation.description,
                        observedAt: new Date().toISOString(),
                    } as any,
                    userId,
                );
    
                await this.observationJobQueue.addInterpretObservationJob({
                    observationId: saved.id,
                });
    
                created.push({ id: saved.id, category: observation.category });
            } catch (error) {
                rejected.push({
                    category: observation.category,
                    reason:
                        error instanceof Error
                            ? error.message
                            : String(error),
                });
            }
        }
    
        for (const r of ingestion.rejected) {
            rejected.push({
                category: r.category,
                reason: r.reason,
            });
        }
    
        // Always save one OTHER observation with the full raw text.
        const rawSaved = await this.observationRepository.create(
            {
                category: 'OTHER' as any,
                propertyId,
                placeId,
                data: null,
                description: text,
                observedAt: new Date().toISOString(),
            } as any,
            userId,
        );
    
        return {
            created,
            rejected,
            unparsed: created.length === 0,
            rawObservationId: rawSaved.id,
        };
    }
}