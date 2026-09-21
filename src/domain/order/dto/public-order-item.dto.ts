import {
  OrderItemEntity,
  OrderItemProps,
} from 'src/domain/order/entities/order-item.entity';

export namespace PublicOrderItem {
  type Props = Required<
    OrderItemProps & {
      id: string;
    }
  >;

  export class Dto implements Props {
    id: string;
    unitPriceAtPurchase: number;
    quantity: number;
    productId: string;
    createdAt: Date;

    constructor(props: Props) {
      this.id = props.id;
      this.unitPriceAtPurchase = props.unitPriceAtPurchase;
      this.quantity = props.quantity;
      this.createdAt = props.createdAt;
      this.productId = props.productId;
    }
  }

  export class Mapper {
    static fromEntity(entity: OrderItemEntity): Dto {
      const json = entity.toJson();
      return new Dto({
        id: json.id,
        unitPriceAtPurchase: json.unitPriceAtPurchase,
        quantity: json.quantity,
        createdAt: json.createdAt,
        productId: json.productId,
      });
    }
  }
}
