import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateOrderDeliveryRequest {
  @ApiPropertyOptional({
    description:
      'Nova data prevista para entrega do pedido. Quando informada, deve estar no formato ISO 8601 contendo timezone, utilizando "Z" para UTC ou um offset, como "-03:00".',
    example: '2026-09-25T14:30:00.000Z',
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
  @IsOptional()
  deliveryDate?: string | undefined;

  @ApiPropertyOptional({
    description:
      'Novo nome da rua ou logradouro onde o pedido deverá ser entregue. Quando informado, deve possuir entre 2 e 128 caracteres.',
    example: 'Avenida Paulista',
    type: String,
    minLength: 2,
    maxLength: 128,
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
  @IsOptional()
  deliveryStreet?: string | undefined;

  @ApiPropertyOptional({
    description:
      'Novo número do imóvel onde o pedido deverá ser entregue. Quando informado, deve ser um número inteiro positivo.',
    example: 1578,
    type: Number,
    minimum: 1,
  })
  @IsInt({
    message: 'O campo deliveryNumber deve ser um número inteiro',
  })
  @Min(1, {
    message: 'O campo deliveryNumber deve ser maior que 0',
  })
  @IsOptional()
  deliveryNumber?: number | undefined;

  @ApiPropertyOptional({
    description:
      'Novo bairro do endereço de entrega. Quando informado, deve possuir entre 2 e 128 caracteres.',
    example: 'Bela Vista',
    type: String,
    minLength: 2,
    maxLength: 128,
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
  @IsOptional()
  deliveryNeighborhood?: string | undefined;

  @ApiPropertyOptional({
    description:
      'Nova cidade do endereço de entrega. Quando informado, deve possuir entre 2 e 64 caracteres.',
    example: 'São Paulo',
    type: String,
    minLength: 2,
    maxLength: 64,
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
  @IsOptional()
  deliveryCity?: string | undefined;

  @ApiPropertyOptional({
    description:
      'Nova unidade federativa (estado) do endereço de entrega. Pode ser informada como sigla ou nome do estado, conforme as regras da aplicação.',
    example: 'SP',
    type: String,
    minLength: 2,
    maxLength: 64,
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
  @IsOptional()
  deliveryState?: string | undefined;

  @ApiPropertyOptional({
    description:
      'Novo CEP do endereço de entrega. Quando informado, deve conter exatamente 8 caracteres e ser informado sem máscara ou hífen.',
    example: '01310100',
    type: String,
    minLength: 8,
    maxLength: 8,
    pattern: '^\\d{8}$',
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
  @IsOptional()
  deliveryZipcode?: string | undefined;

  @ApiPropertyOptional({
    description:
      'Novo complemento do endereço de entrega, como apartamento, bloco, sala ou ponto de referência.',
    example: 'Apartamento 42, Bloco B',
    type: String,
  })
  @IsString({
    message: 'O campo deliveryComplement deve ser uma string válida',
  })
  @IsOptional()
  deliveryComplement?: string | undefined;
}
