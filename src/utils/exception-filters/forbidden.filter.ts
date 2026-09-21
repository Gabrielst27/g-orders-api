import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ForbiddenError } from 'src/domain/shared/errors/forbidden.error';

@Catch(ForbiddenError)
export class ForbiddenFilter implements ExceptionFilter {
  catch(exception: ForbiddenError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    response.status(403).send({
      statusCode: 403,
      error: 'ForbiddenError',
      message: exception.message,
      errors: [exception.error],
    });
  }
}
