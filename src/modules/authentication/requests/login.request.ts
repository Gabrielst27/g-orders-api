import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    description:
      'CPF do usuário utilizado para autenticação. Deve conter exatamente 11 caracteres numéricos, sem pontos, traços ou outros caracteres.',
    example: '12345678901',
    type: String,
    minLength: 11,
    maxLength: 11,
    pattern: '^\\d{11}$',
  })
  @IsNumberString(
    {},
    {
      message: 'O campo cpf deve ser uma string numérica',
    },
  )
  @MinLength(11, {
    message: 'O campo cpf deve ter 11 caracteres',
  })
  @MaxLength(11, {
    message: 'O campo cpf deve ter 11 caracteres',
  })
  @IsNotEmpty({
    message: 'O campo cpf não pode estar vazio',
  })
  cpf!: string;

  @ApiProperty({
    description:
      'Senha utilizada para autenticação do usuário. Deve possuir entre 6 e 60 caracteres.',
    example: 'MinhaSenha123',
    type: String,
    minLength: 6,
    maxLength: 60,
    format: 'password',
  })
  @IsString({
    message: 'O campo password deve ser uma string válida',
  })
  @MinLength(6, {
    message: 'O campo password deve ter pelo menos 6 caracteres',
  })
  @MaxLength(60, {
    message: 'O campo password pode ter no máximo 60 caracteres',
  })
  @IsNotEmpty({
    message: 'O campo password não pode estar vazio',
  })
  password!: string;
}
