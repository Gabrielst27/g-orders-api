import { IUsecase } from 'src/application/shared/usecase';
import { PublicProduct } from 'src/domain/product/dto/public-product.dto';
import { ProductEntity } from 'src/domain/product/entities/product.entity';
import { ProductRepository } from 'src/domain/product/repositories/product.repository';
import { BadRequestError } from 'src/domain/shared/errors/bad-request.error';
import { BadRequestMessage } from 'src/domain/shared/errors/error-messages.enum';

export namespace FindProductsByIdsList {
  export type Input = {
    ids: string[];
  };

  export type Output = PublicProduct.Dto[];

  export class UseCase implements IUsecase<Input, Output> {
    constructor(private readonly repository: ProductRepository) {}

    async execute(input: Input): Promise<Output> {
      const { ids } = input;
      if (!ids || ids.length <= 0) {
        throw new BadRequestError(BadRequestMessage.INVALID_DATA);
      }

      const result = await this.repository.findByIdsList(ids);
      return this.convertToOutput(result);
    }

    private convertToOutput(result: ProductEntity[]): Output {
      return result.map((item) => PublicProduct.Mapper.fromEntity(item));
    }
  }
}
