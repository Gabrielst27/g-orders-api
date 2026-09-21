import { OrderEntity } from 'src/domain/order/entities/order.entity';
import { AppQuery } from 'src/domain/shared/repositories/queries/app-query';
import { Repository } from 'src/domain/shared/repositories/repository';
import { IRepository } from 'src/domain/shared/repositories/repository.interface';
import { SearchParams } from 'src/domain/shared/repositories/search-params';
import { SearchResult } from 'src/domain/shared/repositories/search-result';

export abstract class OrderRepository
  extends Repository
  implements IRepository<OrderEntity>
{
  protected get searchableFields(): string[] {
    return [...super.searchableFields];
  }

  protected get sortableFields(): string[] {
    return [...super.sortableFields];
  }

  abstract findById(id: string): Promise<OrderEntity>;
  abstract findMany(
    params: SearchParams,
    queries: AppQuery[],
  ): Promise<SearchResult<OrderEntity>>;
  abstract create(item: OrderEntity): Promise<OrderEntity>;
  abstract delete(id: string): Promise<OrderEntity>;
}
