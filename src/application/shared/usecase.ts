import {
  AppQuery,
  AppQueryProps,
} from 'src/domain/shared/repositories/queries/app-query';
import {
  SearchParams,
  SearchProps,
} from 'src/domain/shared/repositories/search-params';

export interface IUsecase<Input, Output> {
  execute(input: Input): Output | Promise<Output>;
}

export abstract class SearchUseCase<Input, Output> implements IUsecase<
  Input,
  Output
> {
  abstract execute(input: Input): Output | Promise<Output>;

  protected makeAppQueries(queries: AppQueryProps[]): AppQuery[] {
    const appQueries = queries.map((query) => new AppQuery(query));
    return appQueries;
  }

  protected makeSearchParams(searchProps: SearchProps): SearchParams {
    const params = new SearchParams(searchProps);
    return params;
  }
}
