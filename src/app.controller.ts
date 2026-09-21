import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('Health')
@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar saúde da aplicação',
    description:
      'Verifica se a aplicação está em funcionamento e retorna o status atual do serviço.',
  })
  @ApiOkResponse({
    description: 'Aplicação está funcionando corretamente.',
    type: String,
    example: 'API em funcionamento',
  })
  checkHealth(): string {
    return this.appService.checkHealth();
  }
}
