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
      if (!headers) {
        throw UnauthorizedException;
      }
      const authorization = headers.authorization;

      if (!authorization) {
        throw UnauthorizedException;
      }

      const token: string = authorization.split(' ')[1];
      const payload = await this.authenticationService.verifyToken(token);
      const authUser = {
        id: payload.sub,
        token,
      } as AuthenticatedUser.Props;
      request.user = authUser;
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
