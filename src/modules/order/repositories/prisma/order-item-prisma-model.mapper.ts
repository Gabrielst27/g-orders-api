import { Decimal } from '@prisma/client/runtime/index-browser';
import { OrderItem } from 'generated/prisma/client';
import { OrderItemEntity } from 'src/domain/order/entities/order-item.entity';

export class OrderItemPrismaModelMapper {
  static toModel(entity: OrderItemEntity): OrderItem {
    const json = entity.toJson();
    const orderModel: OrderItem = {
      ID: json.id,
      UNIT_PRICE_AT_PURCHASE: Decimal(json.unitPriceAtPurchase),
      QUANTITY: json.quantity,
      PRODUCT_ID: json.productId,
      ORDER_ID: json.id,
      CREATED_AT: json.createdAt,
    };
    return orderModel;
  }

  static toEntity(model: OrderItem): OrderItemEntity {
    const orderEntity = OrderItemEntity.createExisting(
      {
        unitPriceAtPurchase: Number(model.UNIT_PRICE_AT_PURCHASE),
        quantity: model.QUANTITY,
        productId: model.PRODUCT_ID,
        createdAt: model.CREATED_AT,
      },
      model.ID,
    );
    return orderEntity;
  }
}
