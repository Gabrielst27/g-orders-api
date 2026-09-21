import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { UnauthorizedError } from 'src/domain/shared/errors/unauthorized.error';

@Catch(UnauthorizedError)
export class UnauthorizedFilter implements ExceptionFilter {
  catch(exception: UnauthorizedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    response.status(401).send({
      statusCode: 401,
      error: 'UnauthorizedError',
      message: exception.message,
      errors: [exception.error],
    });
  }
}
