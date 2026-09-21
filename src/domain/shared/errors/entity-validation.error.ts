import { FieldsErrors } from 'src/domain/shared/validators/class-fields-validator';

export class EntityValidationError extends Error {
  constructor(public errors: FieldsErrors) {
    super('Entity validation error');
    this.name = 'EntityValidationError';
  }
}
