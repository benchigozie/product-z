import { plainToInstance } from 'class-transformer';
import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  validate,
} from 'class-validator';

import { ObservationCategory } from '../enums/observation-category.enum.js';
import { observationDataDtoMap } from '../dto/data/observation-data-dto-map.js';

type ObservationWithCategory = {
  category: ObservationCategory;
};

@ValidatorConstraint({ name: 'observationData', async: true })
export class ObservationDataValidator
  implements ValidatorConstraintInterface
{
  async validate(
    value: unknown,
    args: ValidationArguments,
  ): Promise<boolean> {
    const { category } = args.object as ObservationWithCategory;

    const DataDto = observationDataDtoMap[category];

    const categoriesWithoutStructuredData = [
      ObservationCategory.NOISE,
      ObservationCategory.LIGHTING,
      ObservationCategory.ENVIRONMENT,
    ];

    if (categoriesWithoutStructuredData.includes(category)) {
      return value === undefined || value === null;
    }

    if (!DataDto) {
      return false;
    }

    if (value === undefined || value === null) {
      return false;
    }

    const dataDto = plainToInstance(DataDto, value);

    const errors = await validate(dataDto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    return errors.length === 0;
  }

  defaultMessage(args: ValidationArguments): string {
    const { category } = args.object as ObservationWithCategory;

    if (
      category === ObservationCategory.NOISE ||
      category === ObservationCategory.LIGHTING ||
      category === ObservationCategory.ENVIRONMENT
    ) {
      return `${category} observations do not accept structured data`;
    }

    return `Invalid data for observation category ${category}`;
  }
}

export function IsValidObservationData(
  validationOptions?: ValidationOptions,
) {
  return function (
    object: object,
    propertyName: string,
  ): void {
    registerDecorator({
      name: 'isValidObservationData',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: ObservationDataValidator,
    });
  };
}