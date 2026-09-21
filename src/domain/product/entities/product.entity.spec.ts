import {
  ProductEntity,
  ProductEntityProps,
} from 'src/domain/product/entities/product.entity';
import { EntityValidationError } from 'src/domain/shared/errors/entity-validation.error';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'generated-id'),
}));

describe('ProductEntity', () => {
  const validProps: ProductEntityProps = {
    description: 'Valid Product',
    price: 10.99,
  };

  describe('createNew', () => {
    it('should create a new product', () => {
      const product = ProductEntity.createNew(validProps);

      expect(product).toBeInstanceOf(ProductEntity);

      expect(product.toJson()).toEqual(
        expect.objectContaining({
          description: validProps.description,
          price: validProps.price,
        }),
      );
    });

    it('should generate an id and createdAt', () => {
      const product = ProductEntity.createNew(validProps);

      expect(product.toJson()).toEqual(
        expect.objectContaining({
          id: 'generated-id',
          createdAt: expect.any(Date),
        }),
      );
    });

    it('should throw EntityValidationError when price is invalid', () => {
      expect(() =>
        ProductEntity.createNew({
          ...validProps,
          price: -1,
        }),
      ).toThrow(EntityValidationError);
    });
  });

  describe('createExisting', () => {
    it('should create an existing order with the provided id', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const order = ProductEntity.createExisting(
        {
          ...validProps,
          createdAt,
        },
        id,
      );

      expect(order.toJson()).toEqual(
        expect.objectContaining({
          id,
          description: validProps.description,
          price: validProps.price,
          createdAt,
        }),
      );
    });
  });
});
