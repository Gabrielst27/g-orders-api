import { OrderEntity } from 'src/domain/order/entities/order.entity';
import { AppQuery } from 'src/domain/shared/repositories/queries/app-query';
import { Repository } from 'src/domain/shared/repositories/repository';
import { IRepository } from 'src/domain/shared/repositories/repository.interface';
import { SearchParams } from 'src/domain/shared/repositories/search-params';
import { SearchResult } from 'src/domain/shared/repositories/search-result';

export type OrderField = 'NUMBER' | 'DELIVERY_DATE' | 'CUSTOMER_ID' | 'STATUS';

export abstract class OrderRepository
  extends Repository
  implements IRepository<OrderEntity>
{
  protected get searchableFields(): string[] {
    return [
      ...super.searchableFields,
      'NUMBER',
      'CUSTOMER_ID',
      'DELIVERY_DATE',
      'STATUS',
    ];
  }

  protected get sortableFields(): string[] {
    return [...super.sortableFields, 'NUMBER', 'DELIVERY_DATE'];
  }

  abstract findById(id: string): Promise<OrderEntity>;
  abstract findLast(): Promise<OrderEntity | null>;
  abstract findByNumber(number: number): Promise<OrderEntity>;
  abstract findMany(
    params: SearchParams,
    queries: AppQuery[],
  ): Promise<SearchResult<OrderEntity>>;
  abstract create(item: OrderEntity): Promise<OrderEntity>;
  abstract update(item: OrderEntity): Promise<OrderEntity>;
  abstract delete(id: string): Promise<OrderEntity>;
}
