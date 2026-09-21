import {
  AppQuery,
  AppQueryProps,
} from 'src/domain/shared/repositories/queries/app-query';
import { EDbOperators } from 'src/domain/shared/repositories/queries/db-operators.enum';

export function makeQueryProps<K extends string = string>(
  field: K,
  value: string | Date | number | boolean | null,
  operator?: EDbOperators,
): AppQueryProps {
  const op = operator ?? EDbOperators.EQUALS;
  const props = {
    field,
    value,
    operator: op,
  };
  return props;
}

export function makeQuery<K extends string = string>(
  field: K,
  value: string | Date | number | boolean | null,
  operator?: EDbOperators,
): AppQuery {
  const op = operator ?? EDbOperators.EQUALS;
  const props = {
    field,
    value,
    operator: op,
  };
  return new AppQuery(props);
}
