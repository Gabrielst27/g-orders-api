import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Matches,
  Min,
} from 'class-validator';
import { OrderStatus } from 'src/domain/order/enum/order-status.enum';
import { SearchParamsRequest } from 'src/utils/requests/search-params.request';

export class FindManyOrdersQuery extends SearchParamsRequest {
  @ApiPropertyOptional({
    description:
      'Número identificador do pedido. Quando informado, retorna apenas o pedido que possui exatamente este número.',
    example: 123,
    type: Number,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt({
    message: 'O campo number deve ser um número inteiro',
  })
  @Min(1, {
    message: 'O campo number deve ser maior que 0',
  })
  @IsOptional()
  number?: number | undefined;

  @ApiPropertyOptional({
    description:
      'Data inicial do período de entrega utilizado para filtrar os pedidos. Quando informada, serão considerados pedidos cuja data de entrega seja maior ou igual a esta data. Deve estar no formato ISO 8601 e conter timezone (Z ou offset).',
    example: '2026-09-20T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @Matches(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/,
    {
      message:
        'o campo fromDeliveryDate deve ser um datetime ISO 8601 válido com timezone (Z ou offset)',
    },
  )
  @IsOptional()
  fromDeliveryDate?: string | undefined;

  @ApiPropertyOptional({
    description:
      'Data final do período de entrega utilizado para filtrar os pedidos. Quando informada, serão considerados pedidos cuja data de entrega seja menor ou igual a esta data. Deve estar no formato ISO 8601 e conter timezone (Z ou offset).',
    example: '2026-09-30T23:59:59.999Z',
    type: String,
    format: 'date-time',
  })
  @Matches(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/,
    {
      message:
        'o campo toDeliveryDate deve ser um datetime ISO 8601 válido com timezone (Z ou offset)',
    },
  )
  @IsOptional()
  toDeliveryDate?: string | undefined;

  @ApiPropertyOptional({
    description:
      'Identificador único (UUID v4) do cliente. Quando informado, retorna somente os pedidos pertencentes ao cliente especificado.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
  })
  @IsUUID('4', {
    message: 'O campo customerId deve ser um UUID válido',
  })
  @IsOptional()
  customerId?: string | undefined;

  @ApiPropertyOptional({
    description:
      'Status atual do pedido. Quando informado, retorna somente os pedidos que possuem o status especificado.',
    enum: OrderStatus,
    enumName: 'OrderStatus',
    example: OrderStatus.CONFIRMED,
  })
  @IsEnum(OrderStatus, {
    message: 'O campo status deve ser um valor válido do enum OrderStatus',
  })
  @IsOptional()
  status?: OrderStatus | undefined;
}
