import {
  UserEntity,
  UserEntityProps,
} from 'src/domain/user/entities/user.entity';

export namespace PublicUser {
  type Props = Required<Omit<UserEntityProps, 'password'> & { id: string }>;

  export class Dto implements Props {
    id: string;
    username: string;
    cpf: string;
    createdAt: Date;

    constructor(props: Props) {
      this.id = props.id;
      this.username = props.username;
      this.cpf = props.cpf;
      this.createdAt = props.createdAt;
    }
  }

  export class Mapper {
    static fromEntity(entity: UserEntity): Dto {
      const json = entity.toJson();
      return new Dto({
        id: json.id,
        username: json.username,
        cpf: json.cpf,
        createdAt: json.createdAt,
      });
    }
  }
}
