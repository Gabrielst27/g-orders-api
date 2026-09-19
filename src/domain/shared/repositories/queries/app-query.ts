import { AppQueryValidatorFactory } from 'src/domain/shared/repositories/queries/app-query.validator';
import { EDbOperators } from 'src/domain/shared/repositories/queries/db-operators.enum';

export type AppQueryProps = {
  field: string;
  value: string | number | Date | boolean | null;
  operator: EDbOperators;
};

export class AppQuery {
  readonly field: string;
  readonly value: string | number | Date | boolean | null;
  readonly operator: EDbOperators;
  public readonly isValid: boolean = false;

  constructor(props: AppQueryProps) {
    AppQuery.validate(props);
    this.isValid = true;
    this.field = props.field;
    this.value = props.value;
    this.operator = props.operator;
  }

  static validate(props: AppQueryProps): void {
    const validator = AppQueryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new Error('Query inválida');
    }
  }
}
