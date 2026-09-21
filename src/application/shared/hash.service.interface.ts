export interface IHashService {
  hash(value: string);
  compare(value: string, hashValue: string): boolean | Promise<boolean>;
}
