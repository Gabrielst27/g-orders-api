import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedUser } from 'src/domain/auth/models/authenticated-user.model';
import { UnauthorizedMessage } from 'src/domain/shared/errors/error-messages.enum';

export const GetAuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthenticatedUser.Props => {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const user: AuthenticatedUser.Props = request.user;
    if (!user) {
      throw new UnauthorizedException(
        UnauthorizedMessage.USER_NOT_AUTHENTICATED,
      );
    }
    return user;
  },
);
