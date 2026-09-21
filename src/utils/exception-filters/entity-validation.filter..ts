import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { EntityValidationError } from 'src/domain/shared/errors/entity-validation.error';

@Catch(EntityValidationError)
export class EntityValidationFilter implements ExceptionFilter {
  catch(exception: EntityValidationError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    response.status(422).send({
      statusCode: 422,
      name: 'UnprocessableEntity',
      message: exception.message,
      errors: [exception.errors],
    });
  }
}
