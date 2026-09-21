import {
  ProductEntity,
  ProductEntityProps,
} from 'src/domain/product/entities/product.entity';

export namespace PublicProduct {
  type Props = Required<ProductEntityProps & { id: string }>;

  export class Dto implements Props {
    id: string;
    description: string;
    price: number;
    createdAt: Date;

    constructor(props: Props) {
      this.id = props.id;
      this.description = props.description;
      this.price = props.price;
      this.createdAt = props.createdAt;
    }
  }

  export class Mapper {
    static fromEntity(entity: ProductEntity): Dto {
      const json = entity.toJson();
      return new Dto({
        id: json.id,
        description: json.description,
        price: json.price,
        createdAt: json.createdAt,
      });
    }
  }
}
