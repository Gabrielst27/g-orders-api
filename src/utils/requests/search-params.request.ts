import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsAlpha, IsIn, IsInt, IsOptional } from 'class-validator';

import { SearchProps } from 'src/domain/shared/repositories/search-params';

export class SearchParamsRequest implements SearchProps {
  @ApiPropertyOptional({
    description:
      'Número da página que deve ser retornada. Quando não informado, será utilizado o valor padrão definido pela aplicação.',
    example: 0,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'page deve ser um número inteiro',
  })
  page?: number | undefined;

  @ApiPropertyOptional({
    description:
      'Quantidade de registros que devem ser retornados por página. Quando não informado, será utilizado o valor padrão definido pela aplicação.',
    example: 20,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'perPage deve ser um número inteiro',
  })
  perPage?: number | undefined;

  @ApiPropertyOptional({
    description:
      'Nome do campo utilizado para ordenar os resultados. Deve conter somente caracteres alfabéticos.',
    example: 'createdAt',
    type: String,
  })
  @IsOptional()
  @IsAlpha()
  sort?: string | undefined;

  @ApiPropertyOptional({
    description:
      'Direção da ordenação dos resultados. "asc" ordena em ordem crescente e "desc" em ordem decrescente.',
    example: 'desc',
    enum: ['asc', 'desc'],
    enumName: 'SortDirection',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'], {
    message: 'sortDir deve ser "asc" ou "desc"',
  })
  sortDir?: 'asc' | 'desc' | undefined;
}
