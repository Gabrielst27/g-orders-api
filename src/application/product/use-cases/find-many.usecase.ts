import { SearchUseCase } from 'src/application/shared/usecase';
import { PublicProduct } from 'src/domain/product/dto/public-product.dto';
import { ProductEntity } from 'src/domain/product/entities/product.entity';
import { ProductRepository } from 'src/domain/product/repositories/product.repository';
import { AppQueryProps } from 'src/domain/shared/repositories/queries/app-query';
import { SearchProps } from 'src/domain/shared/repositories/search-params';
import { SearchResult } from 'src/domain/shared/repositories/search-result';

export namespace FindManyProducts {
  export type Input = {
    searchProps: SearchProps;
  };

  export type Output = SearchResult<PublicProduct.Dto>;

  export class UseCase extends SearchUseCase<Input, Output> {
    constructor(private readonly repository: ProductRepository) {
      super();
    }

    async execute(input: Input): Promise<Output> {
      const { searchProps } = input;
      const params = super.makeSearchParams(searchProps);

      const queriesProps: AppQueryProps[] = [];

      const queries = super.makeAppQueries(queriesProps);
      const result = await this.repository.findMany(params, queries);
      return this.convertToOutput(result);
    }

    private convertToOutput(result: SearchResult<ProductEntity>): Output {
      const outputs = result.items.map((item) =>
        PublicProduct.Mapper.fromEntity(item),
      );
      return {
        ...result,
        items: outputs,
      };
    }
  }
}
