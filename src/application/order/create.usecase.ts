import { IUsecase } from 'src/application/shared/usecase';
import { PublicOrder } from 'src/domain/order/dto/public-order.dto';
import { OrderEntity } from 'src/domain/order/entities/order.entity';
import { OrderRepository } from 'src/domain/order/repositories/order.repository';
import { BadRequestError } from 'src/domain/shared/errors/bad-request.error';
import { BadRequestMessage } from 'src/domain/shared/errors/error-messages.enum';

export namespace CreateOrder {
  export type Input = {
    deliveryDate: Date;
    deliveryStreet: string;
    deliveryNumber: number;
    deliveryNeighborhood: string;
    deliveryCity: string;
    deliveryState: string;
    deliveryZipcode: string;
    deliveryComplement?: string | undefined;
    customerId: string;
  };

  export type Output = PublicOrder.Dto;

  export class UseCase implements IUsecase<Input, Output> {
    constructor(private readonly repository: OrderRepository) {}

    async execute(input: Input): Promise<PublicOrder.Dto> {
      const {
        deliveryDate,
        deliveryStreet,
        deliveryNumber,
        deliveryNeighborhood,
        deliveryCity,
        deliveryState,
        deliveryZipcode,
        deliveryComplement,
        customerId,
      } = input;
      if (
        !deliveryDate ||
        !deliveryStreet ||
        !deliveryNumber ||
        !deliveryNeighborhood ||
        !deliveryCity ||
        !deliveryState ||
        !deliveryZipcode ||
        !customerId
      ) {
        throw new BadRequestError(BadRequestMessage.INVALID_DATA);
      }
      const latest = await this.repository.findLast();
      const number = latest ? latest.toJson().number + 1 : 1;
      const newOrder = OrderEntity.createNew({
        number,
        deliveryDate,
        deliveryStreet,
        deliveryNumber,
        deliveryNeighborhood,
        deliveryCity,
        deliveryState,
        deliveryZipcode,
        deliveryComplement,
        customerId,
      });
      const result = await this.repository.create(newOrder);
      return PublicOrder.Mapper.fromEntity(result);
    }
  }
}
