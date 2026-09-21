import { Inject, Injectable } from '@nestjs/common';
import { CreateProduct } from 'src/application/product/use-cases/create.usecase';
import { FindProductsByIdsList } from 'src/application/product/use-cases/find-by-ids-list.usecase';
import { CreateProductRequest } from 'src/modules/product/requests/create.request';

@Injectable()
export class ProductService {
  @Inject(CreateProduct.UseCase)
  private readonly createProductUseCase!: CreateProduct.UseCase;
  @Inject(FindProductsByIdsList.UseCase)
  private readonly findByIdsListUseCase!: FindProductsByIdsList.UseCase;

  async create(data: CreateProductRequest) {
    return await this.createProductUseCase.execute({
      price: data.price,
      description: data.description,
    });
  }

  async findByIdsList(ids: string[]) {
    return await this.findByIdsListUseCase.execute({ ids });
  }
}
