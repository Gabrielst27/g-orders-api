import { Inject, Injectable } from '@nestjs/common';
import { CancelOrder } from 'src/application/order/use-cases/cancel.usecase';
import { ConfirmOrder } from 'src/application/order/use-cases/confirm.usecase';
import { CreateOrder } from 'src/application/order/use-cases/create.usecase';
import { DeliverOrder } from 'src/application/order/use-cases/deliver.usecase';
import { FindManyOrders } from 'src/application/order/use-cases/find-many.usecase';
import { ShipOrder } from 'src/application/order/use-cases/ship.usecase';
import { AuthenticatedUser } from 'src/domain/auth/models/authenticated-user.model';
import { CreateOrderRequest } from 'src/modules/order/requests/create.request';
import { FindManyOrdersQuery } from 'src/modules/order/requests/find-many.request';

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

  async create(data: CreateOrderRequest, authUser: AuthenticatedUser.Props) {
    const deliveryDate = new Date(data.deliveryDate);
    return await this.createOrderUseCase.execute({
      customerId: authUser.id,
      ...data,
      deliveryDate: deliveryDate,
    });
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
}
