import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ProductEntityProps } from 'src/domain/product/entities/product.entity';
import { ClassFieldsValidator } from 'src/domain/shared/validators/class-fields-validator';

export class ProductFieldsRules implements ProductEntityProps {
  @Matches(/^[\p{L}\d\s']+$/u, {
    message: 'Apenas letras e espaço em branco são permitidos no nome',
  })
  @MinLength(2)
  @MaxLength(128)
  @IsNotEmpty()
  description: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'O campo price deve ser um número válido com até 2 casas decimais',
    },
  )
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsDate()
  @IsOptional()
  createdAt?: Date | undefined;

  constructor(props: ProductEntityProps) {
    this.description = props.description;
    this.price = props.price;
    this.createdAt = props.createdAt;
  }
}

export class ProductFieldsValidator extends ClassFieldsValidator {
  validate(props: ProductEntityProps): boolean {
    const fieldRules = new ProductFieldsRules(props);
    return super.validate(fieldRules);
  }
}

export class ProductFieldsValidatorFactory {
  static create(): ProductFieldsValidator {
    return new ProductFieldsValidator();
  }
}
