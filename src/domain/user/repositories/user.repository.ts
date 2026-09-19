import { AppQuery } from 'src/domain/shared/repositories/queries/app-query';
import { Repository } from 'src/domain/shared/repositories/repository';
import { IRepository } from 'src/domain/shared/repositories/repository.interface';
import { SearchParams } from 'src/domain/shared/repositories/search-params';
import { SearchResult } from 'src/domain/shared/repositories/search-result';
import { UserEntity } from 'src/domain/user/entities/user.entity';

export abstract class UserRepository
  extends Repository
  implements IRepository<UserEntity>
{
  protected get searchableFields(): string[] {
    return [...super.searchableFields, 'username', 'cpf'];
  }

  protected get sortableFields(): string[] {
    return [...super.sortableFields, 'username'];
  }

  abstract findById(id: string): Promise<UserEntity>;
  abstract findByCpf(cpf: string): Promise<UserEntity>;
  abstract findMany(
    params: SearchParams,
    queries: AppQuery[],
  ): Promise<SearchResult<UserEntity>>;
  abstract create(item: UserEntity): Promise<UserEntity>;
  abstract delete(id: string): Promise<UserEntity>;
}
