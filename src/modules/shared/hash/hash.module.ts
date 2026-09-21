import { Module } from '@nestjs/common';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { BcryptService } from 'src/modules/shared/hash/bcrypt/bcrypt.service';

export const HASH_SERVICE = Symbol('HASH_SERVICE');

@Module({
  imports: [BcryptModule],
  providers: [
    {
      provide: HASH_SERVICE,
      useClass: BcryptService,
    },
  ],
  exports: [HASH_SERVICE],
})
export class HashModule {}
