import { IHashService } from 'src/application/shared/hash.service.interface';
import { IUsecase } from 'src/application/shared/usecase';
import { BadRequestError } from 'src/domain/shared/errors/bad-request.error';
import { BadRequestMessage } from 'src/domain/shared/errors/error-messages.enum';
import { PublicUser } from 'src/domain/user/dto/public-user.dto';
import { UserEntity } from 'src/domain/user/entities/user.entity';
import { UserRepository } from 'src/domain/user/repositories/user.repository';

export namespace SignUp {
  export type Input = {
    username: string;
    cpf: string;
    password: string;
  };

  export type Output = PublicUser.Dto;

  export class UseCase implements IUsecase<Input, Output> {
    constructor(
      private readonly repository: UserRepository,
      private readonly hashService: IHashService,
    ) {}

    async execute(input: Input): Promise<PublicUser.Dto> {
      const { username, cpf, password } = input;
      if (!username || !cpf || !password) {
        throw new BadRequestError(BadRequestMessage.INVALID_DATA);
      }
      const hashPassword = await this.hashService.hash(password);
      const newUser = UserEntity.createNew({
        username,
        cpf,
        password: hashPassword,
      });
      const result = await this.repository.create(newUser);
      return PublicUser.Mapper.fromEntity(result);
    }
  }
}
