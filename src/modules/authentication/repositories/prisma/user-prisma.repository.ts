import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { AppQuery } from 'src/domain/shared/repositories/queries/app-query';
import { SearchParams } from 'src/domain/shared/repositories/search-params';
import { SearchResult } from 'src/domain/shared/repositories/search-result';
import { UserEntity } from 'src/domain/user/entities/user.entity';
import { UserRepository } from 'src/domain/user/repositories/user.repository';
import { UserPrismaModelMapper } from 'src/modules/authentication/repositories/prisma/user-prisma-model.mapper';
import { PrismaService } from 'src/modules/shared/database/prisma/prisma.service';

export class UserPrismaRepository extends UserRepository {
  constructor(private readonly service: PrismaService) {
    super();
  }

  async findById(id: string): Promise<UserEntity> {
    const model = await this.service.user.findUnique({
      where: { ID: id },
    });
    if (!model) {
      throw new NotFoundException('Usuário não encontrado com o id fornecido');
    }
    return UserPrismaModelMapper.toEntity(model);
  }

  async findByCpf(cpf: string): Promise<UserEntity> {
    const model = await this.service.user.findUnique({
      where: { CPF: cpf },
    });
    if (!model) {
      throw new NotFoundException('Usuário não encontrado com o cpf fornecido');
    }
    return UserPrismaModelMapper.toEntity(model);
  }

  findMany(
    params: SearchParams,
    queries: AppQuery[],
  ): Promise<SearchResult<UserEntity>> {
    throw new Error('Method not implemented.');
  }

  async create(item: UserEntity): Promise<UserEntity> {
    const model = UserPrismaModelMapper.toModel(item);
    try {
      await this.service.user.create({ data: model });
      return item;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  delete(id: string): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }
}
