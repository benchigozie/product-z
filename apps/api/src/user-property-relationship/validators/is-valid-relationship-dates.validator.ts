import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
  } from 'class-validator';
  
  export function IsValidRelationshipDates(
    validationOptions?: ValidationOptions,
  ) {
    return function (object: object, propertyName: string) {
      registerDecorator({
        name: 'isValidRelationshipDates',
        target: object.constructor,
        propertyName,
        options: validationOptions,
        validator: {
          validate(value: unknown, args: ValidationArguments) {
            const dto = args.object as {
              startedAt?: string;
              endedAt?: string;
            };
  
            if (!dto.endedAt) {
              return true;
            }
  
            if (!dto.startedAt) {
              return true;
            }
  
            const startedAt = Date.parse(dto.startedAt);
            const endedAt = Date.parse(dto.endedAt);
  
            if (Number.isNaN(startedAt) || Number.isNaN(endedAt)) {
              return true;
            }
  
            return endedAt >= startedAt;
          },
  
          defaultMessage() {
            return 'endedAt must be greater than or equal to startedAt';
          },
        },
      });
    };
  }