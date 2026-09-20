import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { OrderEntity } from 'src/domain/order/entities/order.entity';
import { OrderRepository } from 'src/domain/order/repositories/order.repository';
import { AppQuery } from 'src/domain/shared/repositories/queries/app-query';
import { EDbOperators } from 'src/domain/shared/repositories/queries/db-operators.enum';
import { SearchParams } from 'src/domain/shared/repositories/search-params';
import { SearchResult } from 'src/domain/shared/repositories/search-result';
import { OrderPrismaModelMapper } from 'src/modules/order/repositories/prisma/order-prisma-model.mapper';
import { PrismaService } from 'src/modules/shared/database/prisma/prisma.service';
import { mapToPrismaOperator } from 'src/modules/shared/database/prisma/utils/operator.mapper';

export class OrderPrismaRepository extends OrderRepository {
  constructor(private readonly service: PrismaService) {
    super();
  }

  async findById(id: string): Promise<OrderEntity> {
    const model = await this.service.order.findUnique({
      where: { ID: id },
    });
    if (!model) {
      throw new NotFoundException('Pedido não encontrado com o id fornecido');
    }
    return OrderPrismaModelMapper.toEntity(model);
  }

  async findByNumber(number: number): Promise<OrderEntity> {
    const model = await this.service.order.findUnique({
      where: { NUMBER: number },
    });
    if (!model) {
      throw new NotFoundException(
        'Pedido não encontrado com o number fornecido',
      );
    }
    return OrderPrismaModelMapper.toEntity(model);
  }

  async findMany(
    params: SearchParams,
    queries: AppQuery[],
  ): Promise<SearchResult<OrderEntity>> {
    const isSortable = super.isSortable(params.sort);
    const searchFields = queries.map((query) => query.field);
    super.validateSearchFields(searchFields);
    const sort = isSortable ? params.sort : 'DELIVERY_DATE';
    const take = params.perPage;
    const skip = take * params.page;
    const total = await this.service.order.count({
      where: {
        AND: [
          ...queries.map((query) => ({
            [query.field]:
              query.operator === EDbOperators.EQUALS
                ? query.value
                : { [mapToPrismaOperator(query.operator)]: query.value },
          })),
        ],
      },
    });
    const models = await this.service.order.findMany({
      where: {
        AND: [
          ...queries.map((query) => ({
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
    const items = models.map((model) => OrderPrismaModelMapper.toEntity(model));
    return new SearchResult({
      items,
      total,
      page: params.page,
      perPage: params.perPage,
      sort,
      sortDir: params.sortDir,
    });
  }

  async findLast(): Promise<OrderEntity | null> {
    const model = await this.service.order.findFirst({
      orderBy: { CREATED_AT: 'desc' },
    });
    if (!model) return null;
    return OrderPrismaModelMapper.toEntity(model);
  }

  async create(item: OrderEntity): Promise<OrderEntity> {
    const model = OrderPrismaModelMapper.toModel(item);
    try {
      await this.service.order.create({ data: model });
      return item;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Pedido já existe');
        }
      }
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Erro ao criar pedido');
    }
  }

  async update(item: OrderEntity): Promise<OrderEntity> {
    const model = OrderPrismaModelMapper.toModel(item);
    try {
      await this.service.order.update({
        where: { ID: item.toJson().id },
        data: model,
      });
      return item;
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar pedido');
    }
  }

  delete(id: string): Promise<OrderEntity> {
    throw new Error('Method not implemented.');
  }
}
