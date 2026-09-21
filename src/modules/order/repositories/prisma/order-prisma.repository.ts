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
import { OrderItemPrismaModelMapper } from 'src/modules/order/repositories/prisma/order-item-prisma-model.mapper';
import { OrderPrismaModelMapper } from 'src/modules/order/repositories/prisma/order-prisma-model.mapper';
import { PrismaService } from 'src/modules/shared/database/prisma/prisma.service';
import { mapToPrismaOperator } from 'src/modules/shared/database/prisma/utils/operator.mapper';

export class OrderPrismaRepository extends OrderRepository {
  constructor(private readonly service: PrismaService) {
    super();
  }

  async findById(id: string): Promise<OrderEntity> {
    const macroModel = await this.service.order.findUnique({
      where: { ID: id },
      include: {
        items: true,
      },
    });
    if (!macroModel) {
      throw new NotFoundException('Pedido não encontrado com o id fornecido');
    }
    const { items, ...model } = macroModel;
    return OrderPrismaModelMapper.toEntity(model, items);
  }

  async findByNumber(number: number): Promise<OrderEntity> {
    const macroModel = await this.service.order.findUnique({
      where: { NUMBER: number },
      include: {
        items: true,
      },
    });
    if (!macroModel) {
      throw new NotFoundException(
        'Pedido não encontrado com o number fornecido',
      );
    }
    const { items, ...model } = macroModel;
    return OrderPrismaModelMapper.toEntity(model, items);
  }

  async findMany(
    params: SearchParams,
    queries: AppQuery[],
  ): Promise<SearchResult<OrderEntity>> {
    const isSortable = super.isSortable(params.sort);
    const searchFields = queries.map((query) => query.field);
    super.validateSearchFields(searchFields);

    const mappedQueries = queries.map((query) => ({
      ...query,
      field: this.mapProperty(query.field) ?? query.field,
      value: OrderPrismaModelMapper.mapQueryValue(query.field, query.value),
    }));

    const sort = isSortable
      ? (this.mapProperty(params.sort) ?? 'CREATED_AT')
      : 'CREATED_AT';
    const take = params.perPage;
    const skip = take * params.page;

    const total = await this.service.order.count({
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
    const models = await this.service.order.findMany({
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
      include: {
        items: true,
      },
      skip: skip,
      take: take,
      orderBy: { [sort]: params.sortDir },
    });
    const items = models.map((macroModel) => {
      const { items, ...model } = macroModel;
      return OrderPrismaModelMapper.toEntity(model, items);
    });
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
    const macroModel = await this.service.order.findFirst({
      orderBy: { CREATED_AT: 'desc' },
      include: { items: true },
    });
    if (!macroModel) return null;
    const { items, ...model } = macroModel;
    return OrderPrismaModelMapper.toEntity(model, items);
  }

  async create(item: OrderEntity): Promise<OrderEntity> {
    const model = OrderPrismaModelMapper.toModel(item);
    const items = item.items.map((i) => {
      const macroItem = OrderItemPrismaModelMapper.toModel(i);
      const { ORDER_ID, ...item } = macroItem;
      return item;
    });
    try {
      await this.service.order.create({
        data: { ...model, items: { create: items } },
      });
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
