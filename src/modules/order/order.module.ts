import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { CreateOrder } from 'src/application/order/use-cases/create.usecase';
import { OrderRepository } from 'src/domain/order/repositories/order.repository';
import { PrismaService } from 'src/modules/shared/database/prisma/prisma.service';
import { OrderPrismaRepository } from 'src/modules/order/repositories/prisma/order-prisma.repository';
import { PrismaModule } from 'src/modules/shared/database/prisma/prisma.module';
import { FindManyOrders } from 'src/application/order/use-cases/find-many.usecase';
import { ConfirmOrder } from 'src/application/order/use-cases/confirm.usecase';
import { ShipOrder } from 'src/application/order/use-cases/ship.usecase';
import { DeliverOrder } from 'src/application/order/use-cases/deliver.usecase';
import { CancelOrder } from 'src/application/order/use-cases/cancel.usecase';
import { UpdateOrderDelivery } from 'src/application/order/use-cases/update-address.usecase';

@Module({
  imports: [AuthenticationModule, PrismaModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: 'Repository',
      useFactory: (service: PrismaService) => {
        return new OrderPrismaRepository(service);
      },
      inject: [PrismaService],
    },
    {
      provide: CreateOrder.UseCase,
      useFactory: (repository: OrderRepository) => {
        return new CreateOrder.UseCase(repository);
      },
      inject: ['Repository'],
    },
    {
      provide: FindManyOrders.UseCase,
      useFactory: (repository: OrderRepository) => {
        return new FindManyOrders.UseCase(repository);
      },
      inject: ['Repository'],
    },
    {
      provide: ConfirmOrder.UseCase,
      useFactory: (repository: OrderRepository) => {
        return new ConfirmOrder.UseCase(repository);
      },
      inject: ['Repository'],
    },
    {
      provide: ShipOrder.UseCase,
      useFactory: (repository: OrderRepository) => {
        return new ShipOrder.UseCase(repository);
      },
      inject: ['Repository'],
    },
    {
      provide: DeliverOrder.UseCase,
      useFactory: (repository: OrderRepository) => {
        return new DeliverOrder.UseCase(repository);
      },
      inject: ['Repository'],
    },
    {
      provide: CancelOrder.UseCase,
      useFactory: (repository: OrderRepository) => {
        return new CancelOrder.UseCase(repository);
      },
      inject: ['Repository'],
    },
    {
      provide: UpdateOrderDelivery.UseCase,
      useFactory: (repository: OrderRepository) => {
        return new UpdateOrderDelivery.UseCase(repository);
      },
      inject: ['Repository'],
    },
  ],
})
export class OrderModule {}
