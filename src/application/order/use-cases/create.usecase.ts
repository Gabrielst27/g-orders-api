import { IUsecase } from 'src/application/shared/usecase';
import { PublicOrder } from 'src/domain/order/dto/public-order.dto';
import { OrderItemEntity } from 'src/domain/order/entities/order-item.entity';
import { OrderEntity } from 'src/domain/order/entities/order.entity';
import { OrderRepository } from 'src/domain/order/repositories/order.repository';
import { PublicProduct } from 'src/domain/product/dto/public-product.dto';
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
    items: { product: PublicProduct.Dto; quantity: number }[];
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
        items,
      } = input;
      if (
        !deliveryDate ||
        !deliveryStreet ||
        !deliveryNumber ||
        !deliveryNeighborhood ||
        !deliveryCity ||
        !deliveryState ||
        !deliveryZipcode ||
        !customerId ||
        !items ||
        items.length <= 0
      ) {
        throw new BadRequestError(BadRequestMessage.INVALID_DATA);
      }
      const orderItems = items.map((item) =>
        OrderItemEntity.createNew({
          unitPriceAtPurchase: item.product.price,
          quantity: item.quantity,
          productId: item.product.id,
        }),
      );
      const latest = await this.repository.findLast();
      const number = latest ? latest.toJson().number + 1 : 1;
      const newOrder = OrderEntity.createNew(
        {
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
        },
        orderItems,
      );
      const result = await this.repository.create(newOrder);
      return PublicOrder.Mapper.fromEntity(result);
    }
  }
}
