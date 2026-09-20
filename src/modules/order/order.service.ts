import { Inject, Injectable } from '@nestjs/common';
import { CreateOrder } from 'src/application/order/create.usecase';
import { AuthenticatedUser } from 'src/domain/auth/models/authenticated-user.model';
import { CreateOrderRequest } from 'src/modules/order/requests/create.request';

@Injectable()
export class OrderService {
  @Inject(CreateOrder.UseCase)
  private readonly createOrderUseCase!: CreateOrder.UseCase;

  async create(data: CreateOrderRequest, authUser: AuthenticatedUser.Props) {
    const deliveryDate = new Date(data.deliveryDate);
    return await this.createOrderUseCase.execute({
      customerId: authUser.id,
      ...data,
      deliveryDate: deliveryDate,
    });
  }
}
