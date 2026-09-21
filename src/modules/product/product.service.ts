import { Inject, Injectable } from '@nestjs/common';
import { CreateProduct } from 'src/application/product/use-cases/create.usecase';
import { FindProductsByIdsList } from 'src/application/product/use-cases/find-by-ids-list.usecase';
import { FindManyProducts } from 'src/application/product/use-cases/find-many.usecase';
import { PublicProduct } from 'src/domain/product/dto/public-product.dto';
import { SearchResult } from 'src/domain/shared/repositories/search-result';
import { CreateProductRequest } from 'src/modules/product/requests/create.request';
import { ProductResponse } from 'src/modules/product/responses/product.response';
import { SearchParamsRequest } from 'src/utils/requests/search-params.request';

@Injectable()
export class ProductService {
  @Inject(CreateProduct.UseCase)
  private readonly createProductUseCase!: CreateProduct.UseCase;

  @Inject(FindProductsByIdsList.UseCase)
  private readonly findByIdsListUseCase!: FindProductsByIdsList.UseCase;

  @Inject(FindManyProducts.UseCase)
  private readonly findManyUseCase!: FindManyProducts.UseCase;

  async create(data: CreateProductRequest) {
    return await this.createProductUseCase.execute({
      price: data.price,
      description: data.description,
    });
  }

  async findByIdsList(ids: string[]) {
    return await this.findByIdsListUseCase.execute({ ids });
  }

  async findMany(
    query: SearchParamsRequest,
  ): Promise<SearchResult<ProductResponse>> {
    return await this.findManyUseCase.execute({ searchProps: query });
  }
}
