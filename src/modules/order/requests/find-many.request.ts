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
import { SearchParamsDto } from 'src/domain/shared/dto/search-params.dto';

export class FindManyOrdersQuery extends SearchParamsDto {
  @Type(() => Number)
  @IsInt({ message: 'O campo number deve ser um número inteiro' })
  @Min(1, { message: 'O campo number deve ser maior que 0' })
  @IsOptional()
  number?: number | undefined;

  @Matches(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/,
    {
      message:
        'o campo fromDeliveryDate deve ser um datetime ISO 8601 válido com timezone (Z ou offset)',
    },
  )
  @IsOptional()
  fromDeliveryDate?: string | undefined;

  @Matches(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/,
    {
      message:
        'o campo toDeliveryDate deve ser um datetime ISO 8601 válido com timezone (Z ou offset)',
    },
  )
  @IsOptional()
  toDeliveryDate?: string | undefined;

  @IsUUID('4', { message: 'O campo customerId deve ser um UUID válido' })
  @IsOptional()
  customerId?: string | undefined;

  @IsEnum(OrderStatus, {
    message: 'O campo status deve ser um valor válido do enum OrderStatus',
  })
  @IsOptional()
  status?: OrderStatus | undefined;
}
