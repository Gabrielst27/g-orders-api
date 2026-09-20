import { Inject, Injectable } from '@nestjs/common';
import { Login } from 'src/application/user/use-cases/login.usecase';
import { SignUp } from 'src/application/user/use-cases/sign-up.usecase';
import { Payload } from 'src/domain/auth/models/payload.model';
import { PublicUser } from 'src/domain/user/dto/public-user.dto';
import { LoginRequest } from 'src/modules/authentication/requests/login.request';
import { SignUpRequest } from 'src/modules/authentication/requests/sign-up.request';
import { AuthenticationResponse } from 'src/modules/authentication/responses/auth.response';
import { TokenService } from 'src/modules/authentication/token/token.service';

@Injectable()
export class AuthenticationService {
  @Inject(TokenService) private readonly tokenService!: TokenService;
  @Inject(SignUp.UseCase) private readonly signUpUseCase!: SignUp.UseCase;
  @Inject(Login.UseCase) private readonly loginUseCase!: Login.UseCase;

  async signUp(body: SignUpRequest): Promise<AuthenticationResponse> {
    const publicUser = await this.signUpUseCase.execute(body);
    return this.sign(publicUser);
  }

  async login(body: LoginRequest): Promise<AuthenticationResponse> {
    const publicUser = await this.loginUseCase.execute(body);
    return this.sign(publicUser);
  }

  async verifyToken(token: string): Promise<Payload.Props> {
    return await this.tokenService.verifyToken(token);
  }

  private sign(publicUser: PublicUser.Dto) {
    const payload = Payload.Mapper.createPayload(publicUser);
    const session = this.tokenService.signFinalUser(payload);
    return { accessToken: session.token };
  }
}
