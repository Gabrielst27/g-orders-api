import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { CreateOrder } from 'src/application/order/create.usecase';
import { OrderRepository } from 'src/domain/order/repositories/order.repository';
import { PrismaService } from 'src/modules/shared/database/prisma/prisma.service';
import { OrderPrismaRepository } from 'src/modules/order/repositories/prisma/order-prisma.repository';
import { PrismaModule } from 'src/modules/shared/database/prisma/prisma.module';

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
  ],
})
export class OrderModule {}
