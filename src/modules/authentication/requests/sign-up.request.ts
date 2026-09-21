import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpRequest {
  @ApiProperty({
    description:
      'Nome do usuário. Deve conter somente letras e espaços em branco e possuir entre 2 e 128 caracteres.',
    example: 'Gabriel Torres',
    type: String,
    minLength: 2,
    maxLength: 128,
    pattern: '^[\\p{L}\\s]+$',
  })
  @Matches(/^[\p{L}\s]+$/u, {
    message: 'Apenas letras e espaço em branco são permitidos no nome',
  })
  @MinLength(2, {
    message: 'O campo username deve ter 2 caracteres',
  })
  @MaxLength(128, {
    message: 'O campo username deve ter 128 caracteres',
  })
  @IsNotEmpty({
    message: 'O campo username não pode estar vazio',
  })
  username!: string;

  @ApiProperty({
    description:
      'CPF do usuário. Deve conter exatamente 11 caracteres numéricos, sem pontos, traços ou outros caracteres.',
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
      'Senha utilizada para autenticação. Deve possuir entre 6 e 60 caracteres.',
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
