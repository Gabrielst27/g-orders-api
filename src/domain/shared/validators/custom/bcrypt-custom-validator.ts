import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsBcrypt(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isBcrypt',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return (
            typeof value === 'string' &&
            /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value)
          );
        },
        defaultMessage(validationArguments) {
          return `${validationArguments?.property} deve ser um hash bcrypt válido`;
        },
      },
    });
  };
}
