import { ProductEntity } from 'src/domain/product/entities/product.entity';
import { AppQuery } from 'src/domain/shared/repositories/queries/app-query';
import { Repository } from 'src/domain/shared/repositories/repository';
import { IRepository } from 'src/domain/shared/repositories/repository.interface';
import { SearchParams } from 'src/domain/shared/repositories/search-params';
import { SearchResult } from 'src/domain/shared/repositories/search-result';

export abstract class ProductRepository
  extends Repository
  implements IRepository<ProductEntity>
{
  protected get searchableFields(): string[] {
    return [...super.searchableFields];
  }

  protected get sortableFields(): string[] {
    return [...super.sortableFields];
  }

  abstract findById(id: string): Promise<ProductEntity>;
  abstract findMany(
    params: SearchParams,
    queries: AppQuery[],
  ): Promise<SearchResult<ProductEntity>>;
  abstract findByIdsList(ids: string[]): Promise<ProductEntity[]>;
  abstract create(item: ProductEntity): Promise<ProductEntity>;
  abstract delete(id: string): Promise<ProductEntity>;
}
