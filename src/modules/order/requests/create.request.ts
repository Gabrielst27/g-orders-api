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

class OrderItem {
  @IsUUID('4', { message: 'O campo productId deve ser um UUID válido' })
  @IsNotEmpty({ message: 'O campo productId é obrigatório' })
  productId!: string;

  @IsInt({ message: 'O campo quantity deve ser um número inteiro' })
  @Min(1, { message: 'O campo quantity deve ser maior que 0' })
  @IsNotEmpty({ message: 'O campo quantity é obrigatório' })
  quantity!: number;
}

export class CreateOrderRequest {
  @Matches(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/,
    {
      message:
        'o campo deliveryDate deve ser um datetime ISO 8601 válido com timezone (Z ou offset)',
    },
  )
  @IsNotEmpty({ message: 'O campo deliveryDate é obrigatório' })
  deliveryDate!: string;

  @IsArray({ message: 'O campo itemsIds deve ser um array de IDs' })
  @ValidateNested({
    each: true,
    message: 'O campo itemsIds deve ser um array de objetos válidos',
  })
  @Type(() => OrderItem)
  @ArrayMinSize(1, { message: 'O campo items deve ter pelo menos 1 item' })
  @IsNotEmpty({ message: 'O campo items é obrigatório' })
  items!: OrderItem[];

  @IsString({ message: 'O campo deliveryStreet deve ser uma string válida' })
  @MinLength(2, {
    message: 'O campo deliveryStreet deve ter pelo menos 2 caracteres',
  })
  @MaxLength(128, {
    message: 'O campo deliveryStreet pode ter no máximo 128 caracteres',
  })
  @IsNotEmpty({ message: 'O campo deliveryStreet é obrigatório' })
  deliveryStreet!: string;

  @IsInt()
  @Min(1, { message: 'O campo deliveryNumber deve ser maior que 0' })
  @IsNotEmpty({ message: 'O campo deliveryNumber é obrigatório' })
  deliveryNumber!: number;

  @IsString({
    message: 'O campo deliveryNeighborhood deve ser uma string válida',
  })
  @MinLength(2, {
    message: 'O campo deliveryNeighborhood deve ter pelo menos 2 caracteres',
  })
  @MaxLength(128, {
    message: 'O campo deliveryNeighborhood pode ter no máximo 128 caracteres',
  })
  @IsNotEmpty({ message: 'O campo deliveryNeighborhood é obrigatório' })
  deliveryNeighborhood!: string;

  @IsString({ message: 'O campo deliveryCity deve ser uma string válida' })
  @MinLength(2, {
    message: 'O campo deliveryCity deve ter pelo menos 2 caracteres',
  })
  @MaxLength(64, {
    message: 'O campo deliveryCity pode ter no máximo 64 caracteres',
  })
  @IsNotEmpty({ message: 'O campo deliveryCity é obrigatório' })
  deliveryCity!: string;

  @IsString({ message: 'O campo deliveryState deve ser uma string válida' })
  @MinLength(2, {
    message: 'O campo deliveryState deve ter pelo menos 2 caracteres',
  })
  @MaxLength(64, {
    message: 'O campo deliveryState pode ter no máximo 64 caracteres',
  })
  @IsNotEmpty({ message: 'O campo deliveryState é obrigatório' })
  deliveryState!: string;

  @IsString({ message: 'O campo deliveryZipcode deve ser uma string válida' })
  @MinLength(8, { message: 'O campo deliveryZipcode deve ter 8 caracteres' })
  @MaxLength(8, { message: 'O campo deliveryZipcode deve ter 8 caracteres' })
  @IsNotEmpty({ message: 'O campo deliveryZipcode é obrigatório' })
  deliveryZipcode!: string;

  @IsString({
    message: 'O campo deliveryComplement deve ser uma string válida',
  })
  @IsOptional()
  deliveryComplement?: string | undefined;
}
