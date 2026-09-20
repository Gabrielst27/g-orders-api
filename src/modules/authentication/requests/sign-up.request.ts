import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @Matches(/^[\p{L}\s]+$/u, {
    message: 'Apenas letras e espaço em branco são permitidos no nome',
  })
  @IsNotEmpty({ message: 'O campo username não pode estar vazio' })
  username!: string;

  @IsNumberString({}, { message: 'O campo cpf deve ser uma string numérica' })
  @MinLength(11, {
    message: 'O campo cpf deve ter 11 caracteres',
  })
  @MaxLength(11, {
    message: 'O campo cpf deve ter 11 caracteres',
  })
  @IsNotEmpty({ message: 'O campo cpf não pode estar vazio' })
  cpf!: string;

  @IsString({ message: 'O campo password deve ser uma string válida' })
  @MinLength(6, {
    message: 'O campo password deve ter pelo menos 6 caracteres',
  })
  @MaxLength(60, {
    message: 'O campo password pode ter no máximo 60 caracteres',
  })
  @IsNotEmpty({ message: 'O campo password não pode estar vazio' })
  password!: string;
}
