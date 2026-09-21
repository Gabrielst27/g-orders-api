import { OrderItemFieldsValidatorFactory } from 'src/domain/order/validators/order-item-fields.validator';
import { Entity, EntityProps } from 'src/domain/shared/entities/entity';
import { EntityValidationError } from 'src/domain/shared/errors/entity-validation.error';

export type OrderItemProps = {
  productId: string;
  quantity: number;
  unitPriceAtPurchase: number;
} & EntityProps;

export class OrderItemEntity extends Entity<OrderItemProps> {
  constructor(props: OrderItemProps, id?: string) {
    OrderItemEntity.validateFields(props);
    super(props, id);
  }

  static createNew(props: Omit<OrderItemProps, 'createdAt'>): OrderItemEntity {
    return new OrderItemEntity({
      unitPriceAtPurchase: props.unitPriceAtPurchase,
      quantity: props.quantity,
      productId: props.productId,
    });
  }

  static createExisting(props: OrderItemProps, id: string): OrderItemEntity {
    return new OrderItemEntity(props, id);
  }

  static validateFields(props: OrderItemProps): void {
    const validator = OrderItemFieldsValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) throw new EntityValidationError(validator.errors);
  }
}
