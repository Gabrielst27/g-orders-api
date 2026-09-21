import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { OrderItemProps } from 'src/domain/order/entities/order-item.entity';
import { ClassFieldsValidator } from 'src/domain/shared/validators/class-fields-validator';

export class OrderItemFieldsRules implements OrderItemProps {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  unitPriceAtPurchase: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsUUID('4')
  @IsNotEmpty()
  productId: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date | undefined;

  constructor(props: OrderItemProps) {
    this.productId = props.productId;
    this.unitPriceAtPurchase = props.unitPriceAtPurchase;
    this.quantity = props.quantity;
    this.createdAt = props.createdAt;
  }
}

export class OrderItemFieldsValidator extends ClassFieldsValidator {
  validate(props: OrderItemProps): boolean {
    const fieldRules = new OrderItemFieldsRules(props);
    return super.validate(fieldRules);
  }
}

export class OrderItemFieldsValidatorFactory {
  static create(): OrderItemFieldsValidator {
    return new OrderItemFieldsValidator();
  }
}
