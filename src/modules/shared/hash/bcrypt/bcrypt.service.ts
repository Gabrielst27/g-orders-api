import { Injectable } from '@nestjs/common';
import { IHashService } from 'src/application/shared/hash.service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements IHashService {
  private readonly _salt = 12;
  async hash(value: string): Promise<string> {
    const hashValue = await bcrypt.hash(value, this._salt);
    return hashValue;
  }
  async compare(value: string, hashValue: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hashValue);
    if (!isValid) return false;
    return true;
  }
}
