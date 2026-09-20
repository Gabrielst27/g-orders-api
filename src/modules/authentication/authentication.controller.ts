import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { AuthenticationService } from 'src/modules/authentication/authentication.service';
import { SignUpDto } from 'src/modules/authentication/requests/sign-up.request';

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
  signUp(@Body() data: SignUpDto) {
    return this.authenticationService.signUp(data);
  }
}
