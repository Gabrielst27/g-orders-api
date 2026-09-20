import { OrderStatus } from 'src/domain/order/enum/order-status.enum';
import {
  OrderFieldsValidator,
  OrderFieldsValidatorFactory,
} from 'src/domain/order/validators/order-fields.validator';
import { Entity, EntityProps } from 'src/domain/shared/entities/entity';
import { EntityValidationError } from 'src/domain/shared/errors/entity-validation.error';

export type OrderEntityProps = {
  number: number;
  deliveryDate: Date;
  deliveryStreet: string;
  deliveryNumber: number;
  deliveryNeighborhood: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipcode: string;
  deliveryComplement?: string | undefined;
  customerId: string;
  status: OrderStatus;
  excluded: boolean;
} & EntityProps;

export class OrderEntity extends Entity<OrderEntityProps> {
  protected constructor(props: OrderEntityProps, id?: string) {
    OrderEntity.validateFields(props);
    super(props, id);
  }

  static createNew(
    props: Omit<OrderEntityProps, 'createdAt' | 'excluded'>,
  ): OrderEntity {
    return new OrderEntity({
      number: props.number,
      deliveryDate: props.deliveryDate,
      deliveryStreet: props.deliveryStreet,
      deliveryNumber: props.deliveryNumber,
      deliveryNeighborhood: props.deliveryNeighborhood,
      deliveryCity: props.deliveryCity,
      deliveryState: props.deliveryState,
      deliveryZipcode: props.deliveryZipcode,
      deliveryComplement: props.deliveryComplement,
      customerId: props.customerId,
      status: OrderStatus.CREATED,
      excluded: false,
    });
  }

  static createExisting(props: OrderEntityProps, id: string): OrderEntity {
    return new OrderEntity(props, id);
  }

  static validateFields(props: OrderEntityProps): void {
    const validator = OrderFieldsValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) throw new EntityValidationError(validator.errors);
  }

  updateAddress(
    newAddress: Partial<
      Omit<
        OrderEntityProps,
        'number' | 'status' | 'createdAt' | 'customerId' | 'excluded'
      >
    >,
  ) {
    this.touch(newAddress);
  }

  confirm() {
    const json = this.toJson();
    if (json.status !== OrderStatus.CREATED) {
      const errors = OrderFieldsValidator.makeFieldsErrors();
      const field = 'status';
      OrderFieldsValidator.assignError(
        errors,
        field,
        `Só é possível confirmar um pedido com o status ${OrderStatus.CREATED}`,
      );
      throw new EntityValidationError(errors);
    }
    this.touch({ status: OrderStatus.CONFIRMED });
  }

  ship() {
    const json = this.toJson();
    if (json.status !== OrderStatus.CONFIRMED) {
      const errors = OrderFieldsValidator.makeFieldsErrors();
      const field = 'status';
      OrderFieldsValidator.assignError(
        errors,
        field,
        `Só é possível enviar um pedido com o status ${OrderStatus.CONFIRMED}`,
      );
      throw new EntityValidationError(errors);
    }
    this.touch({ status: OrderStatus.SHIPPED });
  }

  deliver() {
    const json = this.toJson();
    if (json.status !== OrderStatus.SHIPPED) {
      const errors = OrderFieldsValidator.makeFieldsErrors();
      const field = 'status';
      OrderFieldsValidator.assignError(
        errors,
        field,
        `Só é possível entregar um pedido com o status ${OrderStatus.SHIPPED}`,
      );
      throw new EntityValidationError(errors);
    }
    this.touch({ status: OrderStatus.DELIVERED });
  }

  cancel() {
    const json = this.toJson();
    if (json.status === OrderStatus.DELIVERED) {
      const errors = OrderFieldsValidator.makeFieldsErrors();
      const field = 'status';
      OrderFieldsValidator.assignError(
        errors,
        field,
        `Não é possível cancelar um pedido com o status ${OrderStatus.DELIVERED}`,
      );
      throw new EntityValidationError(errors);
    }
    this.touch({ status: OrderStatus.CANCELED });
  }

  exclude() {
    const json = this.toJson();
    if (json.status !== OrderStatus.CANCELED) {
      const errors = OrderFieldsValidator.makeFieldsErrors();
      const field = 'status';
      OrderFieldsValidator.assignError(
        errors,
        field,
        `Só é possível excluir um pedido com o status ${OrderStatus.CANCELED}`,
      );
      throw new EntityValidationError(errors);
    }
    const { id, ...props } = json;
    const newProps: OrderEntityProps = {
      ...props,
      excluded: true,
    };
    super.updateProps(newProps);
  }

  private touch(props: Partial<OrderEntityProps>) {
    const errors = OrderFieldsValidator.makeFieldsErrors();
    const { id, ...json } = this.toJson();
    if (json.excluded) {
      const field = 'excluded';
      OrderFieldsValidator.assignError(
        errors,
        field,
        'Não é possível alterar um pedido excluído',
      );
    }
    if (props.createdAt) {
      const field = 'createdAt';
      OrderFieldsValidator.assignError(
        errors,
        field,
        'Não é possível alterar a data de criação do pedido',
      );
    }
    if (props.customerId) {
      const field = 'customerId';
      OrderFieldsValidator.assignError(
        errors,
        field,
        'Não é possível alterar a data de criação do pedido',
      );
    }
    if (props.excluded) {
      const field = 'excluded';
      OrderFieldsValidator.assignError(
        errors,
        field,
        'Não é possível excluir o pedido através do fluxo padrão de edição.',
      );
    }
    if (Object.keys(errors).length > 0) {
      throw new EntityValidationError(errors);
    }

    const newProps = {
      ...json,
      ...props,
    };
    OrderEntity.validateFields(newProps);
    super.updateProps(newProps);
  }
}
