import { Order, OrderItem, Status } from 'generated/prisma/client';
import { OrderEntity } from 'src/domain/order/entities/order.entity';
import { OrderStatus as AppOrderStatus } from 'src/domain/order/enum/order-status.enum';
import { OrderItemPrismaModelMapper } from 'src/modules/order/repositories/prisma/order-item-prisma-model.mapper';

export class OrderPrismaModelMapper {
  static toModel(entity: OrderEntity): Order {
    const orderJson = entity.toJson();
    const orderModel: Order = {
      ID: orderJson.id,
      NUMBER: orderJson.number,
      DELIVERY_DATE: orderJson.deliveryDate,
      DELIVERY_STREET: orderJson.deliveryStreet,
      DELIVERY_NUMBER: orderJson.deliveryNumber,
      DELIVERY_NEIGHBORHOOD: orderJson.deliveryNeighborhood,
      DELIVERY_CITY: orderJson.deliveryCity,
      DELIVERY_STATE: orderJson.deliveryState,
      DELIVERY_ZIP_CODE: orderJson.deliveryZipcode,
      DELIVERY_COMPLEMENT: orderJson.deliveryComplement,
      CUSTOMER_ID: orderJson.customerId,
      CREATED_AT: orderJson.createdAt,
      EXCLUDED: orderJson.excluded,
      STATUS: this.statusToModelEnum(orderJson.status),
    };
    return orderModel;
  }

  static toEntity(model: Order, items: OrderItem[]): OrderEntity {
    const orderItems = items.map((item) =>
      OrderItemPrismaModelMapper.toEntity(item),
    );
    const orderEntity = OrderEntity.createExisting(
      {
        number: model.NUMBER,
        deliveryDate: model.DELIVERY_DATE,
        deliveryStreet: model.DELIVERY_STREET,
        deliveryNumber: model.DELIVERY_NUMBER,
        deliveryNeighborhood: model.DELIVERY_NEIGHBORHOOD,
        deliveryCity: model.DELIVERY_CITY,
        deliveryState: model.DELIVERY_STATE,
        deliveryZipcode: model.DELIVERY_ZIP_CODE,
        deliveryComplement: model.DELIVERY_COMPLEMENT || undefined,
        customerId: model.CUSTOMER_ID,
        createdAt: model.CREATED_AT,
        excluded: model.EXCLUDED,
        status: this.statusToAppEnum(model.STATUS),
      },
      orderItems,
      model.ID,
    );

    return orderEntity;
  }

  static statusToModelEnum(status: AppOrderStatus): Status {
    const mapper = {
      [AppOrderStatus.CREATED]: Status.CREATED,
      [AppOrderStatus.CONFIRMED]: Status.CONFIRMED,
      [AppOrderStatus.SHIPPED]: Status.SHIPPED,
      [AppOrderStatus.DELIVERED]: Status.DELIVERED,
      [AppOrderStatus.CANCELED]: Status.CANCELED,
    };
    return mapper[status];
  }

  static statusToAppEnum(status: Status): AppOrderStatus {
    const mapper = {
      [Status.CREATED]: AppOrderStatus.CREATED,
      [Status.CONFIRMED]: AppOrderStatus.CONFIRMED,
      [Status.SHIPPED]: AppOrderStatus.SHIPPED,
      [Status.DELIVERED]: AppOrderStatus.DELIVERED,
      [Status.CANCELED]: AppOrderStatus.CANCELED,
    };
    return mapper[status];
  }
}
