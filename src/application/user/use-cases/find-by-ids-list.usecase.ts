import { IUsecase } from 'src/application/shared/usecase';
import { BadRequestError } from 'src/domain/shared/errors/bad-request.error';
import {
  BadRequestMessage,
  ForbiddenMessage,
  UnauthorizedMessage,
} from 'src/domain/shared/errors/error-messages.enum';
import { ForbiddenError } from 'src/domain/shared/errors/forbidden.error';
import { UnauthorizedError } from 'src/domain/shared/errors/unauthorized.error';
import { PublicUser } from 'src/domain/user/dto/public-user.dto';
import { UserRepository } from 'src/domain/user/repositories/user.repository';

export namespace FindUserByIdsList {
  export type Input = {
    ids: string[];
  };

  export type Output = PublicUser.Dto[];

  export class UseCase implements IUsecase<Input, Output> {
    constructor(private readonly repository: UserRepository) {}

    async execute(input: Input): Promise<Output> {
      const { ids } = input;
      if (!ids || ids.length === 0) {
        throw new BadRequestError(BadRequestMessage.INVALID_DATA);
      }
      const result = await this.repository.findByIdsList(ids);
      return result.map((item) => PublicUser.Mapper.fromEntity(item));
    }
  }
}
