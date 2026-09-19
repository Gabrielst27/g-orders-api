import { UnauthorizedMessage } from 'src/domain/shared/errors/error-messages.enum';

export class UnauthorizedError extends Error {
  constructor(public error: UnauthorizedMessage) {
    super('Unauthorized error');
    this.name = 'UnauthorizedError';
  }
}
