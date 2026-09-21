import { ProductFieldsValidatorFactory } from 'src/domain/product/validators/product-fields.validator';
import { Entity, EntityProps } from 'src/domain/shared/entities/entity';
import { EntityValidationError } from 'src/domain/shared/errors/entity-validation.error';

export type ProductEntityProps = {
  description: string;
  price: number;
} & EntityProps;

export class ProductEntity extends Entity<ProductEntityProps> {
  protected constructor(props: ProductEntityProps, id?: string) {
    ProductEntity.validateFields(props);
    super(props, id);
  }

  static createNew(
    props: Omit<ProductEntityProps, 'createdAt'>,
  ): ProductEntity {
    return new ProductEntity({
      description: props.description,
      price: props.price,
    });
  }

  static createExisting(props: ProductEntityProps, id: string): ProductEntity {
    return new ProductEntity(props, id);
  }

  static validateFields(props: ProductEntityProps): void {
    const validator = ProductFieldsValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) throw new EntityValidationError(validator.errors);
  }
}
