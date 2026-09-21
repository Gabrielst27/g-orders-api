import { BadRequestError } from 'src/domain/shared/errors/bad-request.error';
import { BadRequestMessage } from 'src/domain/shared/errors/error-messages.enum';

export abstract class Repository {
  protected get searchableFields(): string[] {
    return ['createdAt'];
  }

  protected get sortableFields(): string[] {
    return ['createdAt'];
  }

  validateSearchFields(fields: string[]): void {
    let isValid = true;
    fields.forEach((field) => {
      if (!this.searchableFields.includes(field)) {
        isValid = false;
      }
    });
    if (!isValid) {
      throw new BadRequestError(
        BadRequestMessage.INVALID_DATA,
        'Campos de busca inválidos',
      );
    }
  }

  validateSortField(field: string): void {
    const isValid = this.sortableFields.includes(field);
    if (!isValid) {
      throw new BadRequestError(
        BadRequestMessage.INVALID_DATA,
        'Campos de ordenação inválidos',
      );
    }
  }

  isSearchable(fields: string[]): boolean {
    let isValid = true;
    fields.forEach((field) => {
      if (!this.searchableFields.includes(field)) {
        isValid = false;
      }
    });
    return isValid;
  }

  isSortable(field: string): boolean {
    return this.sortableFields.includes(field);
  }
}
