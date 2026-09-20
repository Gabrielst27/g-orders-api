import { Inject, Injectable } from '@nestjs/common';
import { CreateOrder } from 'src/application/order/use-cases/create.usecase';
import { FindManyOrders } from 'src/application/order/use-cases/find-many.usecase';
import { AuthenticatedUser } from 'src/domain/auth/models/authenticated-user.model';
import { CreateOrderRequest } from 'src/modules/order/requests/create.request';
import { FindManyOrdersQuery } from 'src/modules/order/requests/find-many.request';

@Injectable()
export class OrderService {
  @Inject(CreateOrder.UseCase)
  private readonly createOrderUseCase!: CreateOrder.UseCase;

  @Inject(FindManyOrders.UseCase)
  private readonly findManyOrdersUseCase!: FindManyOrders.UseCase;

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
}
