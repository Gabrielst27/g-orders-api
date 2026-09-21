import { ApiProperty } from '@nestjs/swagger';
import { ProductResponse } from 'src/modules/product/responses/product.response';

export class SearchProductsResponse {
  @ApiProperty({
    description: 'Lista de produtos encontrados.',
    type: () => [ProductResponse],
  })
  items!: ProductResponse[];

  @ApiProperty({
    description: 'Quantidade total de produtos encontrados.',
    example: 47,
    type: Number,
  })
  total!: number;

  @ApiProperty({
    description: 'Página atual da consulta.',
    example: 0,
    type: Number,
  })
  page!: number;

  @ApiProperty({
    description: 'Quantidade máxima de produtos retornados por página.',
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
    description: 'Campo utilizado para ordenar os produtos.',
    example: 'createdAt',
    type: String,
  })
  sort!: string;

  @ApiProperty({
    description: 'Direção utilizada na ordenação.',
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  sortDir!: 'asc' | 'desc';

  constructor(props: SearchProductsResponse) {
    Object.assign(this, props);
  }
}
