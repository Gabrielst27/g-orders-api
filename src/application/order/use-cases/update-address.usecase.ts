import { IUsecase } from 'src/application/shared/usecase';
import { PublicOrder } from 'src/domain/order/dto/public-order.dto';
import { OrderRepository } from 'src/domain/order/repositories/order.repository';
import { BadRequestError } from 'src/domain/shared/errors/bad-request.error';
import {
  BadRequestMessage,
  ForbiddenMessage,
  UnauthorizedMessage,
} from 'src/domain/shared/errors/error-messages.enum';
import { ForbiddenError } from 'src/domain/shared/errors/forbidden.error';
import { UnauthorizedError } from 'src/domain/shared/errors/unauthorized.error';

export namespace UpdateOrderDelivery {
  export type Input = {
    orderId: string;
    authUserId: string;
    deliveryDate?: Date | undefined;
    deliveryStreet?: string | undefined;
    deliveryNumber?: number | undefined;
    deliveryNeighborhood?: string | undefined;
    deliveryCity?: string | undefined;
    deliveryState?: string | undefined;
    deliveryZipcode?: string | undefined;
    deliveryComplement?: string | undefined;
  };

  export type Output = PublicOrder.Dto;

  export class UseCase implements IUsecase<Input, Output> {
    constructor(private readonly repository: OrderRepository) {}

    async execute(input: Input): Promise<PublicOrder.Dto> {
      const {
        orderId,
        authUserId,
        deliveryDate,
        deliveryStreet,
        deliveryNumber,
        deliveryNeighborhood,
        deliveryCity,
        deliveryState,
        deliveryZipcode,
        deliveryComplement,
      } = input;
      if (!orderId) {
        throw new BadRequestError(BadRequestMessage.INVALID_DATA);
      }
      if (!authUserId) {
        throw new UnauthorizedError(UnauthorizedMessage.USER_NOT_AUTHENTICATED);
      }
      const order = await this.repository.findById(orderId);
      if (order.toJson().customerId !== authUserId) {
        throw new ForbiddenError(ForbiddenMessage.USER_HAVE_NOT_PERMISSION);
      }
      order.updateDelivery({
        deliveryDate,
        deliveryStreet,
        deliveryNumber,
        deliveryCity,
        deliveryNeighborhood,
        deliveryState,
        deliveryZipcode,
        deliveryComplement,
      });
      const result = await this.repository.update(order);
      return PublicOrder.Mapper.fromEntity(result);
    }
  }
}
