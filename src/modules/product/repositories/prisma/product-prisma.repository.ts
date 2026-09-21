import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { ProductEntity } from 'src/domain/product/entities/product.entity';
import { ProductRepository } from 'src/domain/product/repositories/product.repository';
import { AppQuery } from 'src/domain/shared/repositories/queries/app-query';
import { EDbOperators } from 'src/domain/shared/repositories/queries/db-operators.enum';
import { SearchParams } from 'src/domain/shared/repositories/search-params';
import { SearchResult } from 'src/domain/shared/repositories/search-result';
import { ProductPrismaModelMapper } from 'src/modules/product/repositories/prisma/product-prisma-model.mapper';
import { PrismaService } from 'src/modules/shared/database/prisma/prisma.service';
import { mapToPrismaOperator } from 'src/modules/shared/database/prisma/utils/operator.mapper';

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

  async findMany(
    params: SearchParams,
    queries: AppQuery[],
  ): Promise<SearchResult<ProductEntity>> {
    const isSortable = super.isSortable(params.sort);
    const searchFields = queries.map((query) => query.field);

    super.validateSearchFields(searchFields);

    const mappedQueries = queries.map((query) => ({
      ...query,
      field: this.mapProperty(query.field) ?? query.field,
    }));

    const sort = isSortable
      ? (this.mapProperty(params.sort) ?? 'CREATED_AT')
      : 'CREATED_AT';
    const take = params.perPage;
    const skip = take * params.page;

    const total = await this.service.product.count({
      where: {
        AND: [
          ...mappedQueries.map((query) => ({
            [query.field]:
              query.operator === EDbOperators.EQUALS
                ? query.value
                : { [mapToPrismaOperator(query.operator)]: query.value },
          })),
        ],
      },
    });
    const models = await this.service.product.findMany({
      where: {
        AND: [
          ...mappedQueries.map((query) => ({
            [query.field]:
              query.operator === EDbOperators.EQUALS
                ? query.value
                : { [mapToPrismaOperator(query.operator)]: query.value },
          })),
        ],
      },
      skip: skip,
      take: take,
      orderBy: { [sort]: params.sortDir },
    });
    const items = models.map((item) => ProductPrismaModelMapper.toEntity(item));
    return new SearchResult({
      items,
      total,
      page: params.page,
      perPage: params.perPage,
      sort,
      sortDir: params.sortDir,
    });
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
