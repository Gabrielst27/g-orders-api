import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from 'src/modules/authentication/authentication.service';
import { AuthenticatedUser } from 'src/domain/auth/models/authenticated-user.model';
import { UnauthorizedMessage } from 'src/domain/shared/errors/error-messages.enum';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  @Inject(AuthenticationService)
  private readonly authenticationService!: AuthenticationService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const headers = request.headers;
    try {
      const authorization = headers?.authorization;

      if (!authorization) {
        throw new UnauthorizedException('Token não informado');
      }

      const token = authorization.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Token mal formatado');
      }

      const payload = await this.authenticationService.verifyToken(token);
      request.user = {
        id: payload.sub,
        token,
      } as AuthenticatedUser.Props;
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error
          ? error.message
          : UnauthorizedMessage.USER_NOT_AUTHENTICATED,
      );
    }
  }
}
