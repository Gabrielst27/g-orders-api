import { ApiProperty } from '@nestjs/swagger';

export class ProductResponse {
  @ApiProperty({
    description: 'Identificador único do produto.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Descrição ou nome do produto.',
    example: 'Notebook Dell Inspiron 15',
    type: String,
  })
  description!: string;

  @ApiProperty({
    description: 'Preço atual do produto.',
    example: 3499.9,
    type: Number,
    minimum: 0,
  })
  price!: number;

  @ApiProperty({
    description: 'Data e hora em que o produto foi criado.',
    example: '2026-09-21T14:30:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt!: Date;
}
