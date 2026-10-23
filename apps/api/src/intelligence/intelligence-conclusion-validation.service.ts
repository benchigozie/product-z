
import { BadRequestException, Injectable } from '@nestjs/common';
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

        // Validate the DTO's structure before processing its references.
        if (errors.length > 0) {
            console.error(
                'Intelligence conclusion validation errors:',
                JSON.stringify(errors, null, 2),
            );

            console.error(
                'Invalid intelligence conclusion:',
                JSON.stringify(value, null, 2),
            );

            throw new BadRequestException(
                'The intelligence interpreter returned an invalid conclusion.',
            );
        }

        // Accept only exact observation IDs, or the known legacy "power:" prefix.
        // The prefix is removed only when the remainder is a valid observation ID.
        dto.evidenceReferences = dto.evidenceReferences.map((reference) => {
            if (validObservationIds.has(reference)) {
                return reference;
            }

            const prefix = 'power:';

            if (reference.startsWith(prefix)) {
                const rawObservationId = reference.slice(prefix.length);

                if (validObservationIds.has(rawObservationId)) {
                    return rawObservationId;
                }
            }

            return reference;
        });

        const unknownReferences = dto.evidenceReferences.filter(
            (reference) => !validObservationIds.has(reference),
        );

        if (unknownReferences.length > 0) {
            console.error('Unknown evidence references:', unknownReferences);

            throw new BadRequestException(
                'The intelligence conclusion references unknown observations.',
            );
        }

        return dto as unknown as IntelligenceConclusion;
    }
}
