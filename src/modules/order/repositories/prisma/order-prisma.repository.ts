import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { OrderEntity } from 'src/domain/order/entities/order.entity';
import { OrderRepository } from 'src/domain/order/repositories/order.repository';
import { AppQuery } from 'src/domain/shared/repositories/queries/app-query';
import { SearchParams } from 'src/domain/shared/repositories/search-params';
import { SearchResult } from 'src/domain/shared/repositories/search-result';
import { OrderPrismaModelMapper } from 'src/modules/order/repositories/prisma/order-prisma-model.mapper';
import { PrismaService } from 'src/modules/shared/database/prisma/prisma.service';

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

  findMany(
    params: SearchParams,
    queries: AppQuery[],
  ): Promise<SearchResult<OrderEntity>> {
    throw new Error('Method not implemented.');
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

  delete(id: string): Promise<OrderEntity> {
    throw new Error('Method not implemented.');
  }
}
