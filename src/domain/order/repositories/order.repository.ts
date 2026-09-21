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

  protected readonly propertyMapper: Record<string, string> = {
    id: 'ID',
    number: 'NUMBER',
    deliveryDate: 'DELIVERY_DATE',
    deliveryStreet: 'DELIVERY_STREET',
    deliveryNumber: 'DELIVERY_NUMBER',
    deliveryNeighborhood: 'DELIVERY_NEIGHBORHOOD',
    deliveryCity: 'DELIVERY_CITY',
    deliveryState: 'DELIVERY_STATE',
    deliveryZipcode: 'DELIVERY_ZIPCODE',
    deliveryComplement: 'DELIVERY_COMPLEMENT',
    status: 'STATUS',
    customerId: 'CUSTOMER_ID',
    createdAt: 'CREATED_AT',
  };

  protected mapProperty(property?: string): string | undefined {
    if (!property) {
      return undefined;
    }

    return this.propertyMapper[property] ?? property;
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
