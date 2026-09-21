import { Module } from '@nestjs/common';
import { IHashService } from 'src/application/shared/hash.service.interface';
import { FindUserById } from 'src/application/user/use-cases/find-by-id.usecase';
import { FindUserByIdsList } from 'src/application/user/use-cases/find-by-ids-list.usecase';
import { Login } from 'src/application/user/use-cases/login.usecase';
import { SignUp } from 'src/application/user/use-cases/sign-up.usecase';
import { UserRepository } from 'src/domain/user/repositories/user.repository';
import { AuthenticationController } from 'src/modules/authentication/authentication.controller';
import { AuthenticationService } from 'src/modules/authentication/authentication.service';
import { UserPrismaRepository } from 'src/modules/authentication/repositories/prisma/user-prisma.repository';
import { TokenModule } from 'src/modules/authentication/token/token.module';
import { PrismaModule } from 'src/modules/shared/database/prisma/prisma.module';
import { PrismaService } from 'src/modules/shared/database/prisma/prisma.service';
import { BcryptService } from 'src/modules/shared/hash/bcrypt/bcrypt.service';
import { HashModule } from 'src/modules/shared/hash/hash.module';

@Module({
  imports: [PrismaModule, TokenModule, HashModule],
  providers: [
    AuthenticationService,
    {
      provide: 'Repository',
      useFactory: (service: PrismaService) => {
        return new UserPrismaRepository(service);
      },
      inject: [PrismaService],
    },
    {
      provide: 'HashService',
      useClass: BcryptService,
    },
    {
      provide: SignUp.UseCase,
      useFactory: (repository: UserRepository, hashService: IHashService) => {
        return new SignUp.UseCase(repository, hashService);
      },
      inject: ['Repository', 'HashService'],
    },
    {
      provide: Login.UseCase,
      useFactory: (repository: UserRepository, hashService: IHashService) => {
        return new Login.UseCase(repository, hashService);
      },
      inject: ['Repository', 'HashService'],
    },
    {
      provide: FindUserById.UseCase,
      useFactory: (repository: UserRepository) => {
        return new FindUserById.UseCase(repository);
      },
      inject: ['Repository'],
    },
    {
      provide: FindUserByIdsList.UseCase,
      useFactory: (repository: UserRepository) => {
        return new FindUserByIdsList.UseCase(repository);
      },
      inject: ['Repository'],
    },
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
