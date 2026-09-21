import { validateSync } from 'class-validator';

export interface FieldsErrors {
  [field: string]: string[];
}

export abstract class ClassFieldsValidator {
  public errors: FieldsErrors = {};

  static makeFieldsErrors(): FieldsErrors {
    const fieldsErrors: FieldsErrors = {};
    return fieldsErrors;
  }

  static assignError(
    fieldsErrors: FieldsErrors,
    field: string,
    error: string,
  ): void {
    fieldsErrors[field] = fieldsErrors[field]
      ? [...fieldsErrors[field], error]
      : [error];
  }

  validate(fieldsRules: any): boolean {
    const errors = validateSync(fieldsRules);

    if (errors.length) {
      this.errors = {};
      for (const error of errors) {
        if (error.constraints)
          this.errors[error.property] = Object.values(error.constraints);
      }
      return false;
    }
    return true;
  }
}
