import { Entity, EntityProps } from 'src/domain/shared/entities/entity';
import { EntityValidationError } from 'src/domain/shared/errors/entity-validation.error';
import { UserFieldsValidatorFactory } from 'src/domain/user/validators/user-fields.validator';

export type UserEntityProps = {
  username: string;
  cpf: string;
  password: string;
} & EntityProps;

export class UserEntity extends Entity<UserEntityProps> {
  protected constructor(props: UserEntityProps, id?: string) {
    UserEntity.validateFields(props);
    super(props, id);
  }

  static createNew(props: Omit<UserEntityProps, 'createdAt'>): UserEntity {
    return new UserEntity({
      username: props.username,
      cpf: props.cpf,
      password: props.password,
    });
  }

  static createExisting(props: UserEntityProps, id: string): UserEntity {
    return new UserEntity(props, id);
  }

  static validateFields(props: UserEntityProps): void {
    const validator = UserFieldsValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) throw new EntityValidationError(validator.errors);
  }
}
