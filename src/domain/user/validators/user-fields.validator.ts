import {
  IsDate,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ClassFieldsValidator } from 'src/domain/shared/validators/class-fields-validator';
import { IsBcrypt } from 'src/domain/shared/validators/custom/bcrypt-custom-validator';
import { UserEntityProps } from 'src/domain/user/entities/user.entity';

export class UserFieldsRules implements UserEntityProps {
  @Matches(/^[\p{L}\s]+$/u, {
    message: 'Apenas letras e espaço em branco são permitidos no nome',
  })
  @MinLength(2)
  @MaxLength(64)
  @IsNotEmpty()
  username: string;

  @IsNumberString()
  @MinLength(2)
  @MaxLength(64)
  @IsNotEmpty()
  cpf: string;

  @IsBcrypt()
  @IsNotEmpty()
  password: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date | undefined;

  constructor(props: UserEntityProps) {
    this.username = props.username;
    this.cpf = props.cpf;
    this.password = props.password;
    this.createdAt = props.createdAt;
  }
}

export class UserFieldsValidator extends ClassFieldsValidator {
  validate(props: UserEntityProps): boolean {
    const fieldRules = new UserFieldsRules(props);
    return super.validate(fieldRules);
  }
}

export class UserFieldsValidatorFactory {
  static create(): UserFieldsValidator {
    return new UserFieldsValidator();
  }
}
