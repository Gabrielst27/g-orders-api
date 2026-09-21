import { IUsecase } from 'src/application/shared/usecase';
import { PublicProduct } from 'src/domain/product/dto/public-product.dto';
import { ProductEntity } from 'src/domain/product/entities/product.entity';
import { ProductRepository } from 'src/domain/product/repositories/product.repository';
import { BadRequestError } from 'src/domain/shared/errors/bad-request.error';
import { BadRequestMessage } from 'src/domain/shared/errors/error-messages.enum';

export namespace CreateProduct {
  export type Input = {
    description: string;
    price: number;
  };

  export type Output = PublicProduct.Dto;

  export class UseCase implements IUsecase<Input, Output> {
    constructor(private readonly repository: ProductRepository) {}

    async execute(input: Input): Promise<PublicProduct.Dto> {
      const { description, price } = input;
      if (!description || !price) {
        throw new BadRequestError(BadRequestMessage.INVALID_DATA);
      }
      const newProduct = ProductEntity.createNew({
        description,
        price,
      });
      const result = await this.repository.create(newProduct);
      return PublicProduct.Mapper.fromEntity(result);
    }
  }
}
