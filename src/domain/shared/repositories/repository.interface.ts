import { Entity, EntityProps } from 'src/domain/shared/entities/entity';
import { AppQuery } from 'src/domain/shared/repositories/queries/app-query';
import { SearchParams } from 'src/domain/shared/repositories/search-params';
import { SearchResult } from 'src/domain/shared/repositories/search-result';

export interface IRepository<Item extends Entity<EntityProps>> {
  findById(id: string): Promise<Item>;
  findMany(
    params: SearchParams,
    queries: AppQuery[],
  ): Promise<SearchResult<Item>>;
  create(item: Item): Promise<Item>;
  delete(id: string): Promise<Item>;
}
