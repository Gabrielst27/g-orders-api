import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { OrderEntityProps } from 'src/domain/order/entities/order.entity';
import { OrderStatus } from 'src/domain/order/enum/order-status.enum';
import { ClassFieldsValidator } from 'src/domain/shared/validators/class-fields-validator';

export class OrderFieldsRules implements OrderEntityProps {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  number: number;

  @IsDate()
  @IsNotEmpty()
  deliveryDate: Date;

  @IsString()
  @MinLength(2)
  @MaxLength(128)
  @IsNotEmpty()
  deliveryStreet: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  deliveryNumber: number;

  @IsString()
  @MinLength(2)
  @MaxLength(128)
  @IsNotEmpty()
  deliveryNeighborhood: string;

  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @IsNotEmpty()
  deliveryCity: string;

  @IsString()
  @MinLength(2)
  @MaxLength(64)
  @IsNotEmpty()
  deliveryState: string;

  @IsNumberString()
  @MinLength(8)
  @MaxLength(8)
  @IsNotEmpty()
  deliveryZipcode: string;

  @IsString()
  @MinLength(2)
  @MaxLength(128)
  @IsOptional()
  deliveryComplement?: string | undefined;

  @IsUUID('4')
  @IsNotEmpty()
  customerId: string;

  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;

  @IsDate()
  @IsOptional()
  createdAt?: Date | undefined;

  @IsBoolean()
  @IsNotEmpty()
  excluded: boolean;

  constructor(props: OrderEntityProps) {
    this.number = props.number;
    this.deliveryDate = props.deliveryDate;
    this.deliveryStreet = props.deliveryStreet;
    this.deliveryNumber = props.deliveryNumber;
    this.deliveryNeighborhood = props.deliveryNeighborhood;
    this.deliveryCity = props.deliveryCity;
    this.deliveryState = props.deliveryState;
    this.deliveryZipcode = props.deliveryZipcode;
    this.deliveryComplement = props.deliveryComplement;
    this.customerId = props.customerId;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.excluded = props.excluded;
  }
}

export class OrderFieldsValidator extends ClassFieldsValidator {
  validate(props: OrderEntityProps): boolean {
    const fieldRules = new OrderFieldsRules(props);
    return super.validate(fieldRules);
  }
}

export class OrderFieldsValidatorFactory {
  static create(): OrderFieldsValidator {
    return new OrderFieldsValidator();
  }
}
