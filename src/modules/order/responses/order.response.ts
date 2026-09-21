import { PublicOrder } from 'src/domain/order/dto/public-order.dto';
import { OrderStatus } from 'src/domain/order/enum/order-status.enum';
import { PublicProduct } from 'src/domain/product/dto/public-product.dto';

type OrderItemProps = {
  id: string;
  description: string;
  unitPriceAtPurchase: number;
  quantity: number;
  createdAt: Date;
};

type OrderProps = {
  id: string;
  number: number;
  deliveryDate: Date;
  deliveryStreet: string;
  deliveryNumber: number;
  deliveryNeighborhood: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipcode: string;
  deliveryComplement: string;
  status: OrderStatus;
  customerId: string;
  items: OrderItemProps[];
  createdAt: Date;
};

export class OrderResponse {
  id: string;
  number: number;
  deliveryDate: Date;
  deliveryStreet: string;
  deliveryNumber: number;
  deliveryNeighborhood: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipcode: string;
  deliveryComplement: string;
  status: OrderStatus;
  customerId: string;
  items: OrderItemProps[];
  createdAt: Date;

  constructor(props: OrderProps) {
    this.id = props.id;
    this.number = props.number;
    this.customerId = props.customerId;
    this.createdAt = props.createdAt;
    this.deliveryDate = props.deliveryDate;
    this.deliveryStreet = props.deliveryStreet;
    this.deliveryNumber = props.deliveryNumber;
    this.deliveryNeighborhood = props.deliveryNeighborhood;
    this.deliveryCity = props.deliveryCity;
    this.deliveryState = props.deliveryState;
    this.deliveryZipcode = props.deliveryZipcode;
    this.deliveryComplement = props.deliveryComplement;
    this.status = props.status;
    this.items = props.items;
  }

  static mapFromPublicDto(
    dto: PublicOrder.Dto,
    items: PublicProduct.Dto[],
  ): OrderResponse {
    const mappedItems: OrderItemProps[] = items.map((item) => {
      const orderItem = dto.items.find(
        (orderItem) => orderItem.productId === item.id,
      );
      return {
        id: item.id,
        description: item.description,
        unitPriceAtPurchase: orderItem!.unitPriceAtPurchase,
        quantity: orderItem!.quantity,
        createdAt: item.createdAt,
      };
    });
    return new OrderResponse({ ...dto, items: mappedItems });
  }
}
