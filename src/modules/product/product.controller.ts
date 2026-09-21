import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SearchResult } from 'src/domain/shared/repositories/search-result';

import { ProductService } from 'src/modules/product/product.service';
import { ProductResponse } from 'src/modules/product/responses/product.response';
import { SearchParamsRequest } from 'src/utils/requests/search-params.request';

@ApiTags('Products')
@Controller({
  version: '1',
  path: 'products',
})
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar produtos',
    description:
      'Retorna uma lista paginada de produtos, permitindo controlar a paginação e a ordenação dos resultados por meio dos parâmetros de consulta.',
  })
  @ApiOkResponse({
    description: 'Produtos encontrados com sucesso.',
    type: SearchResult<ProductResponse>,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description:
      'Um ou mais parâmetros de consulta possuem formato ou valor inválido.',
  })
  findMany(
    @Query() query: SearchParamsRequest,
  ): Promise<SearchResult<ProductResponse>> {
    return this.service.findMany(query);
  }
}
