import { Decimal } from '@prisma/client/runtime/index-browser';
import { Product } from 'generated/prisma/client';
import { ProductEntity } from 'src/domain/product/entities/product.entity';

export class ProductPrismaModelMapper {
  static toModel(entity: ProductEntity): Product {
    const json = entity.toJson();
    const ProductModel: Product = {
      ID: json.id,
      DESCRIPTION: json.description,
      PRICE: Decimal(json.price),
      CREATED_AT: json.createdAt,
    };
    return ProductModel;
  }

  static toEntity(model: Product): ProductEntity {
    const product = ProductEntity.createExisting(
      {
        description: model.DESCRIPTION,
        price: Number(model.PRICE),
        createdAt: model.CREATED_AT,
      },
      model.ID,
    );
    return product;
  }
}
