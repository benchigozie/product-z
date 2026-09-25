import {
    registerDecorator,
    type ValidationArguments,
    type ValidationOptions,
    ValidatorConstraint,
    type ValidatorConstraintInterface,
  } from 'class-validator';
  
  type ObservationTarget = {
    propertyId?: string;
    placeId?: string;
  };
  
  @ValidatorConstraint({
    name: 'observationTarget',
    async: false,
  })
  export class ObservationTargetValidator
    implements ValidatorConstraintInterface
  {
    validate(
      _value: unknown,
      args: ValidationArguments,
    ): boolean {
      const { propertyId, placeId } =
        args.object as ObservationTarget;
  
      return Boolean(propertyId) !== Boolean(placeId);
    }
  
    defaultMessage(): string {
      return 'An observation must target either a property or a place.';
    }
  }
  
  export function IsValidObservationTarget(
    validationOptions?: ValidationOptions,
  ) {
    return function (
      object: object,
      propertyName: string,
    ): void {
      registerDecorator({
        name: 'isValidObservationTarget',
        target: object.constructor,
        propertyName,
        options: validationOptions,
        validator: ObservationTargetValidator,
      });
    };
  }