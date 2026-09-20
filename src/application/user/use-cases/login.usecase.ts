import { IHashService } from 'src/application/shared/hash.service.interface';
import { IUsecase } from 'src/application/shared/usecase';
import { BadRequestError } from 'src/domain/shared/errors/bad-request.error';
import {
  BadRequestMessage,
  UnauthorizedMessage,
} from 'src/domain/shared/errors/error-messages.enum';
import { UnauthorizedError } from 'src/domain/shared/errors/unauthorized.error';
import { PublicUser } from 'src/domain/user/dto/public-user.dto';
import { UserRepository } from 'src/domain/user/repositories/user.repository';

export namespace Login {
  export type Input = {
    cpf: string;
    password: string;
  };

  export type Output = PublicUser.Dto;

  export class UseCase implements IUsecase<Input, Output> {
    constructor(
      private readonly repository: UserRepository,
      private readonly hashService: IHashService,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { cpf, password } = input;
      if (!cpf || !password) {
        throw new BadRequestError(BadRequestMessage.INVALID_DATA);
      }
      const user = await this.repository.findByCpf(cpf);
      const json = user.toJson();
      const isPasswordValid = await this.hashService.compare(
        password,
        json.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedError(UnauthorizedMessage.INVALID_CREDENTIALS);
      }
      return PublicUser.Mapper.fromEntity(user);
    }
  }
}
