import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { AppQueryProps } from 'src/domain/shared/repositories/queries/app-query';
import { EDbOperators } from 'src/domain/shared/repositories/queries/db-operators.enum';
import { ClassFieldsValidator } from 'src/domain/shared/validators/class-fields-validator';

class AppQueryRules {
  @IsNotEmpty()
  @IsAlpha()
  field!: string;

  @IsOptional()
  @ValidateIf((o) => typeof o.value === 'string')
  @IsString()
  @ValidateIf((o) => typeof o.value === 'number')
  @IsNumber()
  @ValidateIf((o) => o.value instanceof Date)
  @IsDate()
  @Type(() => Date)
  value?: string | Date | number | null;

  @IsNotEmpty()
  @IsEnum(EDbOperators)
  operator!: EDbOperators;

  constructor(props: AppQueryProps) {
    Object.assign(this, props);
  }
}

export class AppQueryValidator extends ClassFieldsValidator {
  validate(data: AppQueryProps): boolean {
    return super.validate(new AppQueryRules(data));
  }
}

export class AppQueryValidatorFactory {
  static create(): AppQueryValidator {
    return new AppQueryValidator();
  }
}
