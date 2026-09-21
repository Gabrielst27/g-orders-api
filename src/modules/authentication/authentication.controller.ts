import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthenticationService } from 'src/modules/authentication/authentication.service';
import { LoginRequest } from 'src/modules/authentication/requests/login.request';
import { SignUpRequest } from 'src/modules/authentication/requests/sign-up.request';
import { AuthenticationResponse } from 'src/modules/authentication/responses/auth.response';

@ApiTags('Authentication')
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthenticationController {
  @Inject(AuthenticationService)
  private readonly authenticationService!: AuthenticationService;

  constructor() {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cadastrar novo usuário',
    description:
      'Cria uma nova conta de usuário utilizando nome, CPF e senha. Após o cadastro, os dados são processados pelo serviço de autenticação.',
  })
  @ApiCreatedResponse({
    description: 'Usuário cadastrado com sucesso.',
    type: AuthenticationResponse,
  })
  @ApiBadRequestResponse({
    description:
      'Os dados enviados são inválidos. Pode ocorrer quando algum campo obrigatório está ausente ou não atende às regras de validação.',
  })
  @ApiConflictResponse({
    description: 'Já existe um usuário cadastrado com o CPF informado.',
  })
  signUp(@Body() data: SignUpRequest): Promise<AuthenticationResponse> {
    return this.authenticationService.signUp(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuário',
    description:
      'Autentica um usuário utilizando CPF e senha e retorna um token JWT que pode ser utilizado para acessar endpoints protegidos da API.',
  })
  @ApiCreatedResponse({
    description: 'Usuário autenticado com sucesso.',
    type: AuthenticationResponse,
  })
  @ApiBadRequestResponse({
    description:
      'Os dados enviados são inválidos. CPF ou senha podem estar ausentes ou possuir formato inválido.',
  })
  @ApiUnauthorizedResponse({
    description:
      'CPF ou senha inválidos. As credenciais fornecidas não correspondem a um usuário autenticável.',
  })
  login(@Body() data: LoginRequest): Promise<AuthenticationResponse> {
    return this.authenticationService.login(data);
  }
}
