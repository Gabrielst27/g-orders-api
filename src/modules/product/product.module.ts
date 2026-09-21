import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaService } from 'src/modules/shared/database/prisma/prisma.service';
import { ProductRepository } from 'src/domain/product/repositories/product.repository';
import { ProductPrismaRepository } from 'src/modules/product/repositories/prisma/product-prisma.repository';
import { PrismaModule } from 'src/modules/shared/database/prisma/prisma.module';
import { CreateProduct } from 'src/application/product/use-cases/create.usecase';
import { FindProductsByIdsList } from 'src/application/product/use-cases/find-by-ids-list.usecase';
import { ProductController } from './product.controller';
import { FindManyProducts } from 'src/application/product/use-cases/find-many.usecase';

@Module({
  imports: [PrismaModule],
  providers: [
    ProductService,
    {
      provide: 'Repository',
      useFactory: (service: PrismaService) => {
        return new ProductPrismaRepository(service);
      },
      inject: [PrismaService],
    },
    {
      provide: CreateProduct.UseCase,
      useFactory: (repository: ProductRepository) => {
        return new CreateProduct.UseCase(repository);
      },
      inject: ['Repository'],
    },
    {
      provide: FindProductsByIdsList.UseCase,
      useFactory: (repository: ProductRepository) => {
        return new FindProductsByIdsList.UseCase(repository);
      },
      inject: ['Repository'],
    },
    {
      provide: FindManyProducts.UseCase,
      useFactory: (repository: ProductRepository) => {
        return new FindManyProducts.UseCase(repository);
      },
      inject: ['Repository'],
    },
  ],
  exports: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
