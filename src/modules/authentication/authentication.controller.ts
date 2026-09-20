import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { AuthenticationService } from 'src/modules/authentication/authentication.service';
import { LoginRequest } from 'src/modules/authentication/requests/login.request';
import { SignUpRequest } from 'src/modules/authentication/requests/sign-up.request';

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
  signUp(@Body() data: SignUpRequest) {
    return this.authenticationService.signUp(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() data: LoginRequest) {
    return this.authenticationService.login(data);
  }
}
