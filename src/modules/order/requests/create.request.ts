import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class OrderItemRequest {
  @ApiProperty({
    description:
      'Identificador único (UUID v4) do produto que será incluído no pedido.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID('4', {
    message: 'O campo productId deve ser um UUID válido',
  })
  @IsNotEmpty({
    message: 'O campo productId é obrigatório',
  })
  productId!: string;

  @ApiProperty({
    description:
      'Quantidade do produto que será adicionada ao pedido. Deve ser um número inteiro maior ou igual a 1.',
    example: 2,
    minimum: 1,
    type: Number,
  })
  @IsInt({
    message: 'O campo quantity deve ser um número inteiro',
  })
  @Min(1, {
    message: 'O campo quantity deve ser maior que 0',
  })
  @IsNotEmpty({
    message: 'O campo quantity é obrigatório',
  })
  quantity!: number;
}

export class CreateOrderRequest {
  @ApiProperty({
    description:
      'Data prevista para entrega do pedido. Deve ser informada como uma string no formato ISO 8601 contendo timezone, utilizando "Z" para UTC ou um offset, como "+03:00".',
    example: '2026-09-20T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Matches(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/,
    {
      message:
        'o campo deliveryDate deve ser um datetime ISO 8601 válido com timezone (Z ou offset)',
    },
  )
  @IsNotEmpty({
    message: 'O campo deliveryDate é obrigatório',
  })
  deliveryDate!: string;

  @ApiProperty({
    description:
      'Lista de produtos que serão adicionados ao pedido. Cada item deve informar o ID do produto e a quantidade desejada. O pedido deve possuir pelo menos um item.',
    type: () => [OrderItemRequest],
    minItems: 1,
    example: [
      {
        productId: '550e8400-e29b-41d4-a716-446655440000',
        quantity: 2,
      },
      {
        productId: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        quantity: 1,
      },
    ],
  })
  @IsArray({
    message: 'O campo items deve ser um array de objetos',
  })
  @ValidateNested({
    each: true,
    message: 'O campo items deve ser um array de objetos válidos',
  })
  @Type(() => OrderItemRequest)
  @ArrayMinSize(1, {
    message: 'O campo items deve ter pelo menos 1 item',
  })
  @IsNotEmpty({
    message: 'O campo items é obrigatório',
  })
  items!: OrderItemRequest[];

  @ApiProperty({
    description: 'Nome da rua ou logradouro onde o pedido deverá ser entregue.',
    example: 'Avenida Paulista',
    minLength: 2,
    maxLength: 128,
    type: String,
  })
  @IsString({
    message: 'O campo deliveryStreet deve ser uma string válida',
  })
  @MinLength(2, {
    message: 'O campo deliveryStreet deve ter pelo menos 2 caracteres',
  })
  @MaxLength(128, {
    message: 'O campo deliveryStreet pode ter no máximo 128 caracteres',
  })
  @IsNotEmpty({
    message: 'O campo deliveryStreet é obrigatório',
  })
  deliveryStreet!: string;

  @ApiProperty({
    description:
      'Número do imóvel onde o pedido deverá ser entregue. Deve ser um número inteiro positivo.',
    example: 1578,
    minimum: 1,
    type: Number,
  })
  @IsInt({
    message: 'O campo deliveryNumber deve ser um número inteiro',
  })
  @Min(1, {
    message: 'O campo deliveryNumber deve ser maior que 0',
  })
  @IsNotEmpty({
    message: 'O campo deliveryNumber é obrigatório',
  })
  deliveryNumber!: number;

  @ApiProperty({
    description: 'Nome do bairro onde o pedido deverá ser entregue.',
    example: 'Bela Vista',
    minLength: 2,
    maxLength: 128,
    type: String,
  })
  @IsString({
    message: 'O campo deliveryNeighborhood deve ser uma string válida',
  })
  @MinLength(2, {
    message: 'O campo deliveryNeighborhood deve ter pelo menos 2 caracteres',
  })
  @MaxLength(128, {
    message: 'O campo deliveryNeighborhood pode ter no máximo 128 caracteres',
  })
  @IsNotEmpty({
    message: 'O campo deliveryNeighborhood é obrigatório',
  })
  deliveryNeighborhood!: string;

  @ApiProperty({
    description: 'Cidade onde o pedido deverá ser entregue.',
    example: 'São Paulo',
    minLength: 2,
    maxLength: 64,
    type: String,
  })
  @IsString({
    message: 'O campo deliveryCity deve ser uma string válida',
  })
  @MinLength(2, {
    message: 'O campo deliveryCity deve ter pelo menos 2 caracteres',
  })
  @MaxLength(64, {
    message: 'O campo deliveryCity pode ter no máximo 64 caracteres',
  })
  @IsNotEmpty({
    message: 'O campo deliveryCity é obrigatório',
  })
  deliveryCity!: string;

  @ApiProperty({
    description:
      'Estado (UF ou nome do estado) onde o pedido deverá ser entregue.',
    example: 'SP',
    minLength: 2,
    maxLength: 64,
    type: String,
  })
  @IsString({
    message: 'O campo deliveryState deve ser uma string válida',
  })
  @MinLength(2, {
    message: 'O campo deliveryState deve ter pelo menos 2 caracteres',
  })
  @MaxLength(64, {
    message: 'O campo deliveryState pode ter no máximo 64 caracteres',
  })
  @IsNotEmpty({
    message: 'O campo deliveryState é obrigatório',
  })
  deliveryState!: string;

  @ApiProperty({
    description:
      'CEP do endereço de entrega. Deve conter exatamente 8 caracteres numéricos, sem máscara.',
    example: '01310100',
    minLength: 8,
    maxLength: 8,
    pattern: '^\\d{8}$',
    type: String,
  })
  @IsString({
    message: 'O campo deliveryZipcode deve ser uma string válida',
  })
  @MinLength(8, {
    message: 'O campo deliveryZipcode deve ter 8 caracteres',
  })
  @MaxLength(8, {
    message: 'O campo deliveryZipcode deve ter 8 caracteres',
  })
  @IsNotEmpty({
    message: 'O campo deliveryZipcode é obrigatório',
  })
  deliveryZipcode!: string;

  @ApiPropertyOptional({
    description:
      'Complemento do endereço de entrega, como apartamento, bloco, sala, casa ou ponto de referência. Este campo é opcional.',
    example: 'Apartamento 42, Bloco B',
    type: String,
  })
  @IsString({
    message: 'O campo deliveryComplement deve ser uma string válida',
  })
  @IsOptional()
  deliveryComplement?: string | undefined;
}
