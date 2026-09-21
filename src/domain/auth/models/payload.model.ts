import { PublicUser } from 'src/domain/user/dto/public-user.dto';

export namespace Payload {
  export type Props = {
    sub: string;
    username: string;
  };

  export class Mapper {
    static createPayload(user: PublicUser.Dto): Props {
      return {
        sub: user.id,
        username: user.username,
      };
    }
  }
}
