import { validateSync } from 'class-validator';

export interface FieldsErrors {
  [field: string]: string[];
}

export abstract class ClassFieldsValidator {
  public errors: FieldsErrors = {};

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
