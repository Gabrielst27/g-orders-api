import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BadRequestError } from 'src/domain/shared/errors/bad-request.error';

@Catch(BadRequestError)
export class BadRequestFilter implements ExceptionFilter {
  catch(exception: BadRequestError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    response.status(400).send({
      statusCode: 400,
      error: 'BadRequestError',
      message: exception.message,
      errors: [exception.error],
    });
  }
}
