import { SearchUseCase } from 'src/application/shared/usecase';
import { PublicOrder } from 'src/domain/order/dto/public-order.dto';
import { OrderEntity } from 'src/domain/order/entities/order.entity';
import {
  OrderField,
  OrderRepository,
} from 'src/domain/order/repositories/order.repository';
import { AppQueryProps } from 'src/domain/shared/repositories/queries/app-query';
import { EDbOperators } from 'src/domain/shared/repositories/queries/db-operators.enum';
import { makeQueryProps } from 'src/domain/shared/repositories/queries/make-query-props';
import { SearchProps } from 'src/domain/shared/repositories/search-params';
import { SearchResult } from 'src/domain/shared/repositories/search-result';

export namespace FindManyOrders {
  export type Input = {
    searchProps: SearchProps;
    number?: number | undefined;
    fromDeliveryDate?: string | undefined;
    toDeliveryDate?: string | undefined;
    customerId?: string | undefined;
    status?: string | undefined;
  };

  export type Output = SearchResult<PublicOrder.Dto>;

  export class UseCase extends SearchUseCase<Input, Output> {
    constructor(private readonly repository: OrderRepository) {
      super();
    }

    async execute(input: Input): Promise<Output> {
      const {
        searchProps,
        number,
        fromDeliveryDate,
        toDeliveryDate,
        customerId,
        status,
      } = input;
      const params = super.makeSearchParams(searchProps);

      const queriesProps: AppQueryProps[] = [];
      number && queriesProps.push(makeQueryProps<OrderField>('NUMBER', number));
      fromDeliveryDate &&
        queriesProps.push(
          makeQueryProps<OrderField>(
            'DELIVERY_DATE',
            fromDeliveryDate,
            EDbOperators.GREATER_THAN_OR_EQUAL,
          ),
        );
      toDeliveryDate &&
        queriesProps.push(
          makeQueryProps<OrderField>(
            'DELIVERY_DATE',
            toDeliveryDate,
            EDbOperators.LESSER_THAN_OR_EQUAL,
          ),
        );
      customerId &&
        queriesProps.push(
          makeQueryProps<OrderField>('CUSTOMER_ID', customerId),
        );
      status && queriesProps.push(makeQueryProps<OrderField>('STATUS', status));

      const queries = super.makeAppQueries(queriesProps);
      const result = await this.repository.findMany(params, queries);
      return this.convertToOutput(result);
    }

    private convertToOutput(result: SearchResult<OrderEntity>): Output {
      const outputs = result.items.map((item) =>
        PublicOrder.Mapper.fromEntity(item),
      );
      return {
        ...result,
        items: outputs,
      };
    }
  }
}
