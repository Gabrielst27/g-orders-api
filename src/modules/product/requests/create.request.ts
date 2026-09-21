import {
  IsNotEmpty,
  IsNumber,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductRequest {
  @Matches(/^[\p{L}\d\s']+$/u, {
    message: 'Apenas letras e espaço em branco são permitidos no nome',
  })
  @MinLength(2, {
    message: 'O campo description deve ter 2 caracteres',
  })
  @MaxLength(128, {
    message: 'O campo description deve ter 128 caracteres',
  })
  @IsNotEmpty({ message: 'O campo description não pode estar vazio' })
  description!: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'O campo price deve ser do tipo number, e pode ter no máximo duas casas decimais',
    },
  )
  @Min(0, { message: 'O campo price deve ser maior ou igual a 0' })
  @IsNotEmpty({ message: 'O campo price não pode estar vazio' })
  price!: number;
}
