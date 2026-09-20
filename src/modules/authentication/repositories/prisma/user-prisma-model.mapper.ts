import { User } from 'generated/prisma/client';
import { UserEntity } from 'src/domain/user/entities/user.entity';

export class UserPrismaModelMapper {
  static toModel(entity: UserEntity): User {
    const userJson = entity.toJson();
    const userModel: User = {
      ID: userJson.id,
      USERNAME: userJson.username,
      PASSWORD: userJson.password,
      CPF: userJson.cpf,
      CREATED_AT: userJson.createdAt,
    };
    return userModel;
  }

  static toEntity(model: User): UserEntity {
    const userEntity = UserEntity.createExisting(
      {
        username: model.USERNAME,
        cpf: model.CPF,
        password: model.PASSWORD,
        createdAt: model.CREATED_AT,
      },
      model.ID,
    );
    return userEntity;
  }
}
