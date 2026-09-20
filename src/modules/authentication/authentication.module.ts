import { Module } from '@nestjs/common';
import { AuthenticationController } from 'src/modules/authentication/authentication.controller';
import { AuthenticationService } from 'src/modules/authentication/authentication.service';
import { UserPrismaRepository } from 'src/modules/authentication/repositories/prisma/user-prisma.repository';
import { PrismaModule } from 'src/modules/shared/database/prisma/prisma.module';
import { PrismaService } from 'src/modules/shared/database/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  providers: [
    AuthenticationService,
    {
      provide: 'Repository',
      useFactory: (service: PrismaService) => {
        return new UserPrismaRepository(service);
      },
      inject: [PrismaService],
    },
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
