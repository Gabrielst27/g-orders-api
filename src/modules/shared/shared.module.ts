import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/modules/shared/database/database.module';
import { HashModule } from 'src/modules/shared/hash/hash.module';

@Module({
  imports: [DatabaseModule, HashModule],
})
export class SharedModule {}
