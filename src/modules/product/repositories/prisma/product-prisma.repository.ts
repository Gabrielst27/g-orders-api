import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { ProductEntity } from 'src/domain/product/entities/product.entity';
import { ProductRepository } from 'src/domain/product/repositories/product.repository';
import { AppQuery } from 'src/domain/shared/repositories/queries/app-query';
import { SearchParams } from 'src/domain/shared/repositories/search-params';
import { SearchResult } from 'src/domain/shared/repositories/search-result';
import { ProductPrismaModelMapper } from 'src/modules/product/repositories/prisma/product-prisma-model.mapper';
import { PrismaService } from 'src/modules/shared/database/prisma/prisma.service';

export class ProductPrismaRepository extends ProductRepository {
  constructor(private readonly service: PrismaService) {
    super();
  }

  async findById(id: string): Promise<ProductEntity> {
    const model = await this.service.product.findUnique({
      where: { ID: id },
    });
    if (!model) {
      throw new NotFoundException('Produto não encontrado com o id fornecido');
    }
    return ProductPrismaModelMapper.toEntity(model);
  }

  findMany(
    params: SearchParams,
    queries: AppQuery[],
  ): Promise<SearchResult<ProductEntity>> {
    throw new Error('Method not implemented.');
  }

  async findByIdsList(ids: string[]): Promise<ProductEntity[]> {
    const models = await this.service.product.findMany({
      where: {
        ID: { in: ids },
      },
    });
    return models.map((model) => ProductPrismaModelMapper.toEntity(model));
  }

  async create(item: ProductEntity): Promise<ProductEntity> {
    const model = ProductPrismaModelMapper.toModel(item);
    try {
      await this.service.product.create({ data: model });
      return item;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Produto já existe');
        }
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro ao criar produto');
    }
  }

  delete(id: string): Promise<ProductEntity> {
    throw new Error('Method not implemented.');
  }
}
