import { ApiProperty } from '@nestjs/swagger';
import { OrderResponse } from 'src/modules/order/responses/order.response';

export class SearchOrderResponse {
  @ApiProperty({
    description: 'Lista de pedidos encontrados.',
    type: () => [OrderResponse],
  })
  items!: OrderResponse[];

  @ApiProperty({
    description: 'Quantidade total de pedidos encontrados.',
    example: 47,
    type: Number,
  })
  total!: number;

  @ApiProperty({
    description: 'Número da página atual.',
    example: 0,
    type: Number,
  })
  page!: number;

  @ApiProperty({
    description: 'Quantidade de pedidos retornados por página.',
    example: 10,
    type: Number,
  })
  perPage!: number;

  @ApiProperty({
    description: 'Número da última página disponível.',
    example: 4,
    type: Number,
  })
  lastPage!: number;

  @ApiProperty({
    description: 'Campo utilizado para ordenar os pedidos.',
    example: 'createdAt',
  })
  sort!: string;

  @ApiProperty({
    description: 'Direção utilizada na ordenação dos pedidos.',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  sortDir!: 'asc' | 'desc';
}
