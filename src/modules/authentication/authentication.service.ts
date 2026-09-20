import { Inject, Injectable } from '@nestjs/common';
import { SignUp } from 'src/application/user/use-cases/sign-up.usecase';
import { Payload } from 'src/domain/auth/models/payload.model';
import { SignUpDto } from 'src/modules/authentication/requests/sign-up.request';
import { AuthenticationResponse } from 'src/modules/authentication/responses/auth.response';
import { TokenService } from 'src/modules/authentication/token/token.service';

@Injectable()
export class AuthenticationService {
  @Inject(TokenService) private readonly tokenService!: TokenService;
  @Inject(SignUp.UseCase) private readonly signUpUseCase!: SignUp.UseCase;

  async signUp(body: SignUpDto): Promise<AuthenticationResponse> {
    const publicUser = await this.signUpUseCase.execute(body);
    const payload = Payload.Mapper.createPayload(publicUser);
    const session = this.tokenService.signFinalUser(payload);
    return { accessToken: session.token };
  }

  async verifyToken(token: string): Promise<Payload.Props> {
    return await this.tokenService.verifyToken(token);
  }
}
