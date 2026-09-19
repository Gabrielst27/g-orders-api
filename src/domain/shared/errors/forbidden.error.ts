import { ForbiddenMessage } from 'src/domain/shared/errors/error-messages.enum';

export class ForbiddenError extends Error {
  constructor(public error: ForbiddenMessage) {
    super('Forbidden error');
    this.name = 'ForbiddenError';
  }
}
