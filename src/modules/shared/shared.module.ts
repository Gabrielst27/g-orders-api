import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/modules/shared/database/database.module';

@Module({
  imports: [DatabaseModule],
})
export class SharedModule {}
