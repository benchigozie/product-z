import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { IntelligenceConclusionDto } from './dto/intelligence-conclusion.dto.js';
import { ObservationCategory } from '../observation/enums/observation-category.enum.js';
import { PowerCondition } from './enums/power-condition.enum.js';
import { FloodingCondition } from './enums/flooding-condition.enum.js';
import type { ValidatedConclusion } from './types/validated-conclusion.type.js';
import { WaterCondition } from './enums/water-condition.enum.js';



@Injectable()
export class IntelligenceConclusionValidationService {
    async validate(
        value: unknown,
        validObservationIds: ReadonlySet<string>,
        category: ObservationCategory,
    ): Promise<ValidatedConclusion> {
        const dto = plainToInstance(IntelligenceConclusionDto, value);

        const errors = await validate(dto, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });

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

        // Category-specific conclusion value check.
        const expectedValues: readonly string[] =
    category === ObservationCategory.POWER
        ? Object.values(PowerCondition)
        : category === ObservationCategory.WATER
          ? Object.values(WaterCondition)
          : category === ObservationCategory.FLOODING
            ? Object.values(FloodingCondition)
            : [];

        if (
            expectedValues.length > 0 &&
            !expectedValues.includes(dto.conclusion)
        ) {
            throw new BadRequestException(
                `The conclusion '${dto.conclusion}' is not valid for category ${category}.`,
            );
        }

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

        return dto as unknown as ValidatedConclusion;
    }
}