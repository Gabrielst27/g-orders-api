import { Type } from 'class-transformer';
import { IsAlpha, IsIn, IsInt, IsOptional } from 'class-validator';
import { SearchProps } from 'src/domain/shared/repositories/search-params';

export class SearchParamsDto implements SearchProps {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page deve ser um número inteiro' })
  page?: number | undefined;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'perPage deve ser um número inteiro' })
  perPage?: number | undefined;

  @IsOptional()
  @IsAlpha()
  sort?: string | undefined;

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'sortDir deve ser "asc" ou "desc"' })
  sortDir?: 'asc' | 'desc' | undefined;
}
