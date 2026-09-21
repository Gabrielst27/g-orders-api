import { Inject, Injectable } from '@nestjs/common';
import { CancelOrder } from 'src/application/order/use-cases/cancel.usecase';
import { ConfirmOrder } from 'src/application/order/use-cases/confirm.usecase';
import { CreateOrder } from 'src/application/order/use-cases/create.usecase';
import { DeliverOrder } from 'src/application/order/use-cases/deliver.usecase';
import { FindManyOrders } from 'src/application/order/use-cases/find-many.usecase';
import { ShipOrder } from 'src/application/order/use-cases/ship.usecase';
import { UpdateOrderDelivery } from 'src/application/order/use-cases/update-address.usecase';
import { AuthenticatedUser } from 'src/domain/auth/models/authenticated-user.model';
import { PublicOrderItem } from 'src/domain/order/dto/public-order-item.dto';
import { PublicOrder } from 'src/domain/order/dto/public-order.dto';
import { BadRequestError } from 'src/domain/shared/errors/bad-request.error';
import { BadRequestMessage } from 'src/domain/shared/errors/error-messages.enum';
import { SearchResult } from 'src/domain/shared/repositories/search-result';
import { AuthenticationService } from 'src/modules/authentication/authentication.service';
import { CreateOrderRequest } from 'src/modules/order/requests/create.request';
import { FindManyOrdersQuery } from 'src/modules/order/requests/find-many.request';
import { UpdateOrderDeliveryRequest } from 'src/modules/order/requests/update-delivery.request';
import { OrderResponse } from 'src/modules/order/responses/order.response';
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

  async create(
    data: CreateOrderRequest,
    authUser: AuthenticatedUser.Props,
  ): Promise<OrderResponse> {
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
    return OrderResponse.mapFromPublicDto(order, products);
  }

  async findMany(
    query: FindManyOrdersQuery,
  ): Promise<SearchResult<OrderResponse>> {
    const {
      number,
      fromDeliveryDate,
      toDeliveryDate,
      customerId,
      status,
      ...searchProps
    } = query;
    const orders = await this.findManyOrdersUseCase.execute({
      searchProps,
      number,
      fromDeliveryDate,
      toDeliveryDate,
      customerId,
      status,
    });
    const mappedOrders = await this.mapOrdersToResponse(orders.items);
    return {
      ...orders,
      items: mappedOrders,
    };
  }

  async confirm(
    orderId: string,
    authUser: AuthenticatedUser.Props,
  ): Promise<OrderResponse> {
    const order = await this.confirmOrderUseCase.execute({
      orderId,
      authUserId: authUser.id,
    });
    return this.mapOrdersToResponse([order])[0];
  }
  async ship(
    orderId: string,
    authUser: AuthenticatedUser.Props,
  ): Promise<OrderResponse> {
    const order = await this.shipOrderUseCase.execute({
      orderId,
      authUserId: authUser.id,
    });
    return this.mapOrdersToResponse([order])[0];
  }
  async deliver(
    orderId: string,
    authUser: AuthenticatedUser.Props,
  ): Promise<OrderResponse> {
    const order = await this.deliverOrderUseCase.execute({
      orderId,
      authUserId: authUser.id,
    });
    return this.mapOrdersToResponse([order])[0];
  }
  async cancel(
    orderId: string,
    authUser: AuthenticatedUser.Props,
  ): Promise<OrderResponse> {
    const order = await this.cancelOrderUseCase.execute({
      orderId,
      authUserId: authUser.id,
    });
    return this.mapOrdersToResponse([order])[0];
  }

  async updateDelivery(
    orderId: string,
    data: UpdateOrderDeliveryRequest,
    authUser: AuthenticatedUser.Props,
  ): Promise<OrderResponse> {
    const deliveryDate = data.deliveryDate
      ? new Date(data.deliveryDate)
      : undefined;
    const order = await this.updateOrderDeliveryUseCase.execute({
      orderId,
      authUserId: authUser.id,
      ...data,
      deliveryDate,
    });
    return this.mapOrdersToResponse([order])[0];
  }

  private async mapOrdersToResponse(
    orders: PublicOrder.Dto[],
  ): Promise<OrderResponse[]> {
    const allItems: PublicOrderItem.Dto[] = [];
    orders.forEach((order) => allItems.push(...order.items));
    if (allItems.length === 0) {
      return orders.map((order) => OrderResponse.mapFromPublicDto(order, []));
    }

    const productsIds = [...new Set(allItems.map((item) => item.productId))];
    const products = await this.productService.findByIdsList(productsIds);

    return orders.map((order) => {
      const orderProductIds = new Set(
        order.items.map((item) => item.productId),
      );
      const orderProducts = products.filter((product) =>
        orderProductIds.has(product.id),
      );
      return OrderResponse.mapFromPublicDto(order, orderProducts);
    });
  }
}
