import { ApiProperty } from '@nestjs/swagger';
import { PublicOrder } from 'src/domain/order/dto/public-order.dto';
import { OrderStatus } from 'src/domain/order/enum/order-status.enum';
import { PublicProduct } from 'src/domain/product/dto/public-product.dto';
import { PublicUser } from 'src/domain/user/dto/public-user.dto';

export class OrderItemResponse {
  @ApiProperty({
    description:
      'Identificador único do item do pedido. Corresponde ao identificador do produto associado ao item.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Descrição do produto no momento da consulta.',
    example: 'Notebook Dell Inspiron 15',
  })
  description!: string;

  @ApiProperty({
    description:
      'Preço unitário do produto registrado no momento em que o pedido foi realizado.',
    example: 3499.9,
    type: Number,
  })
  unitPriceAtPurchase!: number;

  @ApiProperty({
    description: 'Quantidade do produto incluída no pedido.',
    example: 2,
    type: Number,
    minimum: 1,
  })
  quantity!: number;

  @ApiProperty({
    description: 'Data e hora em que o item foi adicionado ao pedido.',
    example: '2026-09-21T14:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  addedAt!: Date;
}

export class OrderCustomerResponse {
  @ApiProperty({
    description: 'Identificador único do cliente que realizou o pedido.',
    example: '550e8400-e29b-41d4-a716-446655440001',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Nome de usuário do cliente.',
    example: 'Gabriel Torres',
  })
  username!: string;
}

export class OrderResponse {
  @ApiProperty({
    description: 'Identificador único do pedido.',
    example: '550e8400-e29b-41d4-a716-446655440002',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description:
      'Número sequencial utilizado para identificação do pedido perante o sistema.',
    example: 10025,
    type: Number,
  })
  number: number;

  @ApiProperty({
    description: 'Data prevista para entrega do pedido.',
    example: '2026-09-25T14:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  deliveryDate: Date;

  @ApiProperty({
    description: 'Rua ou logradouro do endereço de entrega.',
    example: 'Avenida Paulista',
  })
  deliveryStreet: string;

  @ApiProperty({
    description: 'Número do imóvel do endereço de entrega.',
    example: 1578,
    type: Number,
  })
  deliveryNumber: number;

  @ApiProperty({
    description: 'Bairro do endereço de entrega.',
    example: 'Bela Vista',
  })
  deliveryNeighborhood: string;

  @ApiProperty({
    description: 'Cidade do endereço de entrega.',
    example: 'São Paulo',
  })
  deliveryCity: string;

  @ApiProperty({
    description: 'Estado ou unidade federativa do endereço de entrega.',
    example: 'SP',
  })
  deliveryState: string;

  @ApiProperty({
    description: 'CEP do endereço de entrega.',
    example: '01310100',
  })
  deliveryZipcode: string;

  @ApiProperty({
    description:
      'Complemento do endereço de entrega, como apartamento, bloco ou sala.',
    example: 'Apartamento 42, Bloco B',
  })
  deliveryComplement: string;

  @ApiProperty({
    description:
      'Status atual do pedido, indicando a etapa em que o pedido se encontra no fluxo de entrega.',
    enum: OrderStatus,
    enumName: 'OrderStatus',
    example: OrderStatus.CONFIRMED,
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Cliente associado ao pedido.',
    type: () => OrderCustomerResponse,
  })
  customer: OrderCustomerResponse;

  @ApiProperty({
    description: 'Lista de produtos incluídos no pedido.',
    type: () => [OrderItemResponse],
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        description: 'Notebook Dell Inspiron 15',
        unitPriceAtPurchase: 3499.9,
        quantity: 2,
        addedAt: '2026-09-21T14:30:00.000Z',
      },
    ],
  })
  items: OrderItemResponse[];

  @ApiProperty({
    description: 'Data e hora em que o pedido foi criado.',
    example: '2026-09-21T14:30:00.000Z',
    type: String,
    format: 'date-time',
  })
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
    const mappedItems: OrderItemResponse[] = items.map((item) => {
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

    const mappedCustomer: OrderCustomerResponse = {
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
