
import { Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { IntelligenceConclusionDto } from './dto/intelligence-conclusion.dto.js';
import type { IntelligenceConclusion } from './types/intelligence-conclusion.type.js';

@Injectable()
export class IntelligenceConclusionValidationService {
    async validate(
        value: unknown,
        validObservationIds: ReadonlySet<string>,
    ): Promise<IntelligenceConclusion> {
        const dto = plainToInstance(IntelligenceConclusionDto, value);

        const errors = await validate(dto, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

        if (errors.length > 0) {
            throw new BadRequestException(
                'The intelligence interpreter returned an invalid conclusion.',
            );
        }

        const unknownReferences = dto.evidenceReferences.filter(
            (id) => !validObservationIds.has(id),
        );

        if (unknownReferences.length > 0) {
            throw new BadRequestException(
                'The intelligence interpreter referenced unknown observations.',
            );
        }

        return dto;
    }
}
