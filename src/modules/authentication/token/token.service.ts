import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthenticatedUser } from 'src/domain/auth/models/authenticated-user.model';
import { Payload } from 'src/domain/auth/models/payload.model';
import { ExpireValue } from 'src/domain/auth/models/token-expire-options';
import { UnauthorizedMessage } from 'src/domain/shared/errors/error-messages.enum';

@Injectable()
export class TokenService {
  @Inject(JwtService) private readonly jwtService!: JwtService;

  private readonly accessExpiresIn: ExpireValue = process.env
    .JWT_ACCESS_TOKEN_EXPIRES_IN as ExpireValue;

  constructor() {}

  signFinalUser(payload: Payload.Props): AuthenticatedUser.Props {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.accessExpiresIn,
    });

    return {
      id: payload.sub,
      token: accessToken,
    };
  }

  async verifyToken(token: string): Promise<Payload.Props> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(UnauthorizedMessage.TOKEN_EXPIRED);
      }
      throw new UnauthorizedException(
        error instanceof Error
          ? error.message
          : UnauthorizedMessage.USER_NOT_AUTHENTICATED,
      );
    }
  }
}
