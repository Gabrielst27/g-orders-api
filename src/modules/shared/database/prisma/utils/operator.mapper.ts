import { EDbOperators } from 'src/domain/shared/repositories/queries/db-operators.enum';

export function mapToPrismaOperator(opEnum: EDbOperators) {
  const mapper = {
    equal: 'equals',
    in: 'in',
    not_in: 'notin',
    lesser_than: 'lt',
    lesser_than_or_equal: 'lte',
    greater_than: 'gt',
    greater_than_or_equal: 'gte',
    not: 'not',
    contains: 'contains',
  };
  return mapper[opEnum];
}
