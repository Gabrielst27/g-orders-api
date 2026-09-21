import { PublicOrder } from 'src/domain/order/dto/public-order.dto';
import { OrderStatus } from 'src/domain/order/enum/order-status.enum';
import { PublicProduct } from 'src/domain/product/dto/public-product.dto';
import { PublicUser } from 'src/domain/user/dto/public-user.dto';

type OrderItemProps = {
  id: string;
  description: string;
  unitPriceAtPurchase: number;
  quantity: number;
  addedAt: Date;
};

type OrderCustomerProps = {
  id: string;
  username: string;
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
  customer: OrderCustomerProps;
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
  customer: OrderCustomerProps;
  items: OrderItemProps[];
  createdAt: Date;

  constructor(props: OrderProps) {
    this.id = props.id;
    this.number = props.number;
    this.customer = props.customer;
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
    customer: PublicUser.Dto,
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
        addedAt: item.createdAt,
      };
    });
    const mappedCustomer: OrderCustomerProps = {
      id: customer.id,
      username: customer.username,
    };
    return new OrderResponse({
      ...dto,
      items: mappedItems,
      customer: mappedCustomer,
    });
  }
}
