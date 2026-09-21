import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/modules/shared/database/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
})
export class DatabaseModule {}
