import { BadRequestMessage } from 'src/domain/shared/errors/error-messages.enum';

export class BadRequestError extends Error {
  constructor(
    public error: BadRequestMessage,
    message?: string,
  ) {
    super(`${error}${message ? `: ${message}` : '.'}`);
    this.name = 'BadRequestError';
  }
}
