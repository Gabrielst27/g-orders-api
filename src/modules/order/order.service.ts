import { Inject, Injectable } from '@nestjs/common';
import { CancelOrder } from 'src/application/order/use-cases/cancel.usecase';
import { ConfirmOrder } from 'src/application/order/use-cases/confirm.usecase';
import { CreateOrder } from 'src/application/order/use-cases/create.usecase';
import { DeliverOrder } from 'src/application/order/use-cases/deliver.usecase';
import { FindManyOrders } from 'src/application/order/use-cases/find-many.usecase';
import { ShipOrder } from 'src/application/order/use-cases/ship.usecase';
import { UpdateOrderDelivery } from 'src/application/order/use-cases/update-address.usecase';
import { AuthenticatedUser } from 'src/domain/auth/models/authenticated-user.model';
import { BadRequestError } from 'src/domain/shared/errors/bad-request.error';
import { BadRequestMessage } from 'src/domain/shared/errors/error-messages.enum';
import { CreateOrderRequest } from 'src/modules/order/requests/create.request';
import { FindManyOrdersQuery } from 'src/modules/order/requests/find-many.request';
import { UpdateOrderDeliveryRequest } from 'src/modules/order/requests/update-delivery.request';
import { ProductService } from 'src/modules/product/product.service';

@Injectable()
export class OrderService {
  @Inject(CreateOrder.UseCase)
  private readonly createOrderUseCase!: CreateOrder.UseCase;

  @Inject(FindManyOrders.UseCase)
  private readonly findManyOrdersUseCase!: FindManyOrders.UseCase;

  @Inject(ConfirmOrder.UseCase)
  private readonly confirmOrderUseCase!: ConfirmOrder.UseCase;

  @Inject(ShipOrder.UseCase)
  private readonly shipOrderUseCase!: ShipOrder.UseCase;

  @Inject(DeliverOrder.UseCase)
  private readonly deliverOrderUseCase!: DeliverOrder.UseCase;

  @Inject(CancelOrder.UseCase)
  private readonly cancelOrderUseCase!: CancelOrder.UseCase;

  @Inject(UpdateOrderDelivery.UseCase)
  private readonly updateOrderDeliveryUseCase!: UpdateOrderDelivery.UseCase;

  @Inject(ProductService) private readonly productService!: ProductService;

  async create(data: CreateOrderRequest, authUser: AuthenticatedUser.Props) {
    const products = await this.productService.findByIdsList(
      data.items.map((item) => item.productId),
    );
    if (products.length !== data.items.length) {
      throw new BadRequestError(
        BadRequestMessage.INVALID_DATA,
        'Não foram encontrados produtos para todo(s) o(s) id(s) passado(s)',
      );
    }
    const items = products.map((product) => {
      const quantity = data.items.find(
        (i) => i.productId === product.id,
      )!.quantity;
      return {
        product,
        quantity,
      };
    });
    const deliveryDate = new Date(data.deliveryDate);
    const order = await this.createOrderUseCase.execute({
      customerId: authUser.id,
      ...data,
      deliveryDate: deliveryDate,
      items,
    });
    return {
      ...order,
      items: products,
    };
  }

  async findMany(query: FindManyOrdersQuery) {
    const {
      number,
      fromDeliveryDate,
      toDeliveryDate,
      customerId,
      status,
      ...searchProps
    } = query;
    return await this.findManyOrdersUseCase.execute({
      searchProps,
      number,
      fromDeliveryDate,
      toDeliveryDate,
      customerId,
      status,
    });
  }

  async confirm(orderId: string, authUser: AuthenticatedUser.Props) {
    return await this.confirmOrderUseCase.execute({
      orderId,
      authUserId: authUser.id,
    });
  }
  async ship(orderId: string, authUser: AuthenticatedUser.Props) {
    return await this.shipOrderUseCase.execute({
      orderId,
      authUserId: authUser.id,
    });
  }
  async deliver(orderId: string, authUser: AuthenticatedUser.Props) {
    return await this.deliverOrderUseCase.execute({
      orderId,
      authUserId: authUser.id,
    });
  }
  async cancel(orderId: string, authUser: AuthenticatedUser.Props) {
    return await this.cancelOrderUseCase.execute({
      orderId,
      authUserId: authUser.id,
    });
  }

  async updateDelivery(
    orderId: string,
    data: UpdateOrderDeliveryRequest,
    authUser: AuthenticatedUser.Props,
  ) {
    const deliveryDate = data.deliveryDate
      ? new Date(data.deliveryDate)
      : undefined;
    return await this.updateOrderDeliveryUseCase.execute({
      orderId,
      authUserId: authUser.id,
      ...data,
      deliveryDate,
    });
  }
}
