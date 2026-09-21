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
  @Matches(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/,
    {
      message:
        'o campo deliveryDate deve ser um datetime ISO 8601 válido com timezone (Z ou offset)',
    },
  )
  @IsOptional()
  deliveryDate?: string | undefined;

  @IsString({ message: 'O campo deliveryStreet deve ser uma string válida' })
  @MinLength(2, {
    message: 'O campo deliveryStreet deve ter pelo menos 2 caracteres',
  })
  @MaxLength(128, {
    message: 'O campo deliveryStreet pode ter no máximo 128 caracteres',
  })
  @IsOptional()
  deliveryStreet?: string | undefined;

  @IsInt()
  @Min(1, { message: 'O campo deliveryNumber deve ser maior que 0' })
  @IsOptional()
  deliveryNumber?: number | undefined;

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

  @IsString({ message: 'O campo deliveryCity deve ser uma string válida' })
  @MinLength(2, {
    message: 'O campo deliveryCity deve ter pelo menos 2 caracteres',
  })
  @MaxLength(64, {
    message: 'O campo deliveryCity pode ter no máximo 64 caracteres',
  })
  @IsOptional()
  deliveryCity?: string | undefined;

  @IsString({ message: 'O campo deliveryState deve ser uma string válida' })
  @MinLength(2, {
    message: 'O campo deliveryState deve ter pelo menos 2 caracteres',
  })
  @MaxLength(64, {
    message: 'O campo deliveryState pode ter no máximo 64 caracteres',
  })
  @IsOptional()
  deliveryState?: string | undefined;

  @IsString({ message: 'O campo deliveryZipcode deve ser uma string válida' })
  @MinLength(8, { message: 'O campo deliveryZipcode deve ter 8 caracteres' })
  @MaxLength(8, { message: 'O campo deliveryZipcode deve ter 8 caracteres' })
  @IsOptional()
  deliveryZipcode?: string | undefined;

  @IsString({
    message: 'O campo deliveryComplement deve ser uma string válida',
  })
  @IsOptional()
  deliveryComplement?: string | undefined;
}
