import {
  OrderEntity,
  OrderEntityProps,
} from 'src/domain/order/entities/order.entity';
import { OrderStatus } from 'src/domain/order/enum/order-status.enum';

export namespace PublicOrder {
  type Props = Required<Omit<OrderEntityProps, 'excluded'> & { id: string }>;

  export class Dto implements Props {
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
    createdAt: Date;

    constructor(props: Props) {
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
    }
  }

  export class Mapper {
    static fromEntity(entity: OrderEntity): Dto {
      const json = entity.toJson();
      return new Dto({
        id: json.id,
        number: json.number,
        customerId: json.customerId,
        createdAt: json.createdAt,
        deliveryDate: json.deliveryDate,
        deliveryStreet: json.deliveryStreet,
        deliveryNumber: json.deliveryNumber,
        deliveryNeighborhood: json.deliveryNeighborhood,
        deliveryCity: json.deliveryCity,
        deliveryState: json.deliveryState,
        deliveryZipcode: json.deliveryZipcode,
        deliveryComplement: json.deliveryComplement ?? '',
        status: json.status,
      });
    }
  }
}
