import {
  OrderEntity,
  OrderEntityProps,
} from 'src/domain/order/entities/order.entity';
import { OrderStatus } from 'src/domain/order/enum/order-status.enum';
import { EntityValidationError } from 'src/domain/shared/errors/entity-validation.error';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'generated-id'),
}));

describe('OrderEntity', () => {
  const validProps: OrderEntityProps = {
    number: 1,
    deliveryDate: new Date('2026-10-20'),
    deliveryStreet: '123 Main St',
    deliveryNumber: 100,
    deliveryNeighborhood: 'Downtown',
    deliveryCity: 'City',
    deliveryState: 'State',
    deliveryZipcode: '12345678',
    deliveryComplement: 'Apt 1',
    customerId: '550e8400-e29b-41d4-a716-446655440000',
    status: OrderStatus.CREATED,
    excluded: false,
  };

  describe('createNew', () => {
    it('should create a new order', () => {
      const order = OrderEntity.createNew(validProps);

      expect(order).toBeInstanceOf(OrderEntity);

      expect(order.toJson()).toEqual(
        expect.objectContaining({
          number: validProps.number,
          deliveryDate: validProps.deliveryDate,
          deliveryStreet: validProps.deliveryStreet,
          deliveryNumber: validProps.deliveryNumber,
          deliveryNeighborhood: validProps.deliveryNeighborhood,
          deliveryCity: validProps.deliveryCity,
          deliveryState: validProps.deliveryState,
          deliveryZipcode: validProps.deliveryZipcode,
          deliveryComplement: validProps.deliveryComplement,
          customerId: validProps.customerId,
        }),
      );
    });

    it('should generate an id and createdAt', () => {
      const order = OrderEntity.createNew(validProps);

      expect(order.toJson()).toEqual(
        expect.objectContaining({
          id: 'generated-id',
          createdAt: expect.any(Date),
        }),
      );
    });

    it('should throw EntityValidationError when number is invalid', () => {
      expect(() =>
        OrderEntity.createNew({
          ...validProps,
          number: -1,
        }),
      ).toThrow(EntityValidationError);
    });

    it('should throw EntityValidationError when deliveryDate is lesser or equal than now', () => {
      expect(() =>
        OrderEntity.createNew({
          ...validProps,
          deliveryDate: new Date('2000-00-00'),
        }),
      ).toThrow(EntityValidationError);
    });

    it('should throw EntityValidationError when deliveryDate is invalid', () => {
      expect(() =>
        OrderEntity.createNew({
          ...validProps,
          deliveryDate: new Date('invalid-date'),
        }),
      ).toThrow(EntityValidationError);
    });

    it('should throw EntityValidationError when deliveryStreet is invalid', () => {
      expect(() =>
        OrderEntity.createNew({
          ...validProps,
          deliveryStreet: ' ',
        }),
      ).toThrow(EntityValidationError);
    });
  });

  describe('createExisting', () => {
    it('should create an existing order with the provided id', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const order = OrderEntity.createExisting(
        {
          ...validProps,
          createdAt,
        },
        id,
      );

      expect(order.toJson()).toEqual(
        expect.objectContaining({
          id,
          number: validProps.number,
          deliveryDate: validProps.deliveryDate,
          deliveryStreet: validProps.deliveryStreet,
          deliveryNumber: validProps.deliveryNumber,
          deliveryNeighborhood: validProps.deliveryNeighborhood,
          deliveryCity: validProps.deliveryCity,
          deliveryState: validProps.deliveryState,
          deliveryZipcode: validProps.deliveryZipcode,
          deliveryComplement: validProps.deliveryComplement,
          customerId: validProps.customerId,
          createdAt,
        }),
      );
    });
  });

  describe('confirm', () => {
    it('should change status to confirmed', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const order = OrderEntity.createExisting(
        {
          ...validProps,
          status: OrderStatus.CREATED,
          createdAt,
        },
        id,
      );

      order.confirm();

      expect(order.toJson().status).toBe(OrderStatus.CONFIRMED);
    });

    it('should throw EntityValidationError when try to confirm an order with status different from created', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const order = OrderEntity.createExisting(
        {
          ...validProps,
          status: OrderStatus.CREATED,
          createdAt,
        },
        id,
      );

      order.confirm();
      order.ship();

      expect(() => order.confirm()).toThrow(EntityValidationError);
    });
  });

  describe('ship', () => {
    it('should change status to shipped', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const order = OrderEntity.createExisting(
        {
          ...validProps,
          createdAt,
        },
        id,
      );

      order.confirm();
      order.ship();

      expect(order.toJson().status).toBe(OrderStatus.SHIPPED);
    });

    it('should throw EntityValidationError when try to ship an order with status different from confirmed', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const order = OrderEntity.createExisting(
        {
          ...validProps,
          status: OrderStatus.CREATED,
          createdAt,
        },
        id,
      );

      expect(() => order.ship()).toThrow(EntityValidationError);
    });
  });

  describe('deliver', () => {
    it('should change status to delivered', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const order = OrderEntity.createExisting(
        {
          ...validProps,
          createdAt,
        },
        id,
      );

      order.confirm();
      order.ship();
      order.deliver();

      expect(order.toJson().status).toBe(OrderStatus.DELIVERED);
    });

    it('should throw EntityValidationError when try to deliver an order with status different from shipped', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const order = OrderEntity.createExisting(
        {
          ...validProps,
          status: OrderStatus.CREATED,
          createdAt,
        },
        id,
      );

      expect(() => order.deliver()).toThrow(EntityValidationError);
    });
  });

  describe('cancel', () => {
    it('should change status to canceled', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const order = OrderEntity.createExisting(
        {
          ...validProps,
          createdAt,
        },
        id,
      );

      order.cancel();

      expect(order.toJson().status).toBe(OrderStatus.CANCELED);
    });

    it('should throw EntityValidationError when try to cancel an order with status delivered', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const order = OrderEntity.createExisting(
        {
          ...validProps,
          status: OrderStatus.CREATED,
          createdAt,
        },
        id,
      );

      order.confirm();
      order.ship();
      order.deliver();

      expect(() => order.cancel()).toThrow(EntityValidationError);
    });
  });

  describe('exclude', () => {
    it('should change excluded to true', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const order = OrderEntity.createExisting(
        {
          ...validProps,
          createdAt,
        },
        id,
      );

      order.cancel();
      order.exclude();

      expect(order.toJson().excluded).toBe(true);
    });

    it('should throw EntityValidationError when try to update an excluded order', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const order = OrderEntity.createExisting(
        {
          ...validProps,
          status: OrderStatus.CREATED,
          createdAt,
        },
        id,
      );

      order.cancel();
      order.exclude();

      expect(() => order.updateDelivery({})).toThrow(EntityValidationError);
    });

    it('should throw EntityValidationError when try to exclude a non canceled order', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const order = OrderEntity.createExisting(
        {
          ...validProps,
          status: OrderStatus.CREATED,
          createdAt,
        },
        id,
      );

      expect(() => order.exclude()).toThrow(EntityValidationError);
    });
  });
});
