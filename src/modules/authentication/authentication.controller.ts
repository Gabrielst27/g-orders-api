import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { AuthenticationService } from 'src/modules/authentication/authentication.service';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthenticationController {
  @Inject(AuthenticationService)
  private readonly authenticationService!: AuthenticationService;

  constructor() {}
}
