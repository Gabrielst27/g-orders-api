import { EntityValidationError } from 'src/domain/shared/errors/entity-validation.error';
import { UserEntity } from 'src/domain/user/entities/user.entity';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'generated-id'),
}));

describe('UserEntity', () => {
  const validProps = {
    username: 'Gabriel Torres',
    cpf: '12345678901',
    password: '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  };

  describe('createNew', () => {
    it('should create a new user', () => {
      const user = UserEntity.createNew(validProps);

      expect(user).toBeInstanceOf(UserEntity);

      expect(user.toJson()).toEqual(
        expect.objectContaining({
          username: validProps.username,
          cpf: validProps.cpf,
          password: validProps.password,
        }),
      );
    });

    it('should generate an id and createdAt', () => {
      const user = UserEntity.createNew(validProps);

      expect(user.toJson()).toEqual(
        expect.objectContaining({
          id: 'generated-id',
          createdAt: expect.any(Date),
        }),
      );
    });

    it('should throw EntityValidationError when username is invalid', () => {
      expect(() =>
        UserEntity.createNew({
          ...validProps,
          username: '',
        }),
      ).toThrow(EntityValidationError);
    });

    it('should throw EntityValidationError when cpf is invalid', () => {
      expect(() =>
        UserEntity.createNew({
          ...validProps,
          cpf: 'abcdefghijk',
        }),
      ).toThrow(EntityValidationError);
    });

    it('should throw EntityValidationError when password is invalid', () => {
      expect(() =>
        UserEntity.createNew({
          ...validProps,
          password: 'password',
        }),
      ).toThrow(EntityValidationError);
    });
  });

  describe('createExisting', () => {
    it('should create an existing user with the provided id', () => {
      const id = '550e8400-e29b-41d4-a716-446655440000';
      const createdAt = new Date('2026-01-01T00:00:00.000Z');

      const user = UserEntity.createExisting(
        {
          ...validProps,
          createdAt,
        },
        id,
      );

      expect(user.toJson()).toEqual(
        expect.objectContaining({
          id,
          username: validProps.username,
          cpf: validProps.cpf,
          password: validProps.password,
          createdAt,
        }),
      );
    });
  });
});
