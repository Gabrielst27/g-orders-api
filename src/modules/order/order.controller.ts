import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import type { AuthenticatedUser } from 'src/domain/auth/models/authenticated-user.model';
import { AuthenticationGuard } from 'src/modules/authentication/guards/authentication.guard';
import { OrderService } from 'src/modules/order/order.service';
import { OrderResponse } from 'src/modules/order/responses/order.response';
import { CreateOrderRequest } from 'src/modules/order/requests/create.request';
import { FindManyOrdersQuery } from 'src/modules/order/requests/find-many.request';
import { UpdateOrderDeliveryRequest } from 'src/modules/order/requests/update-delivery.request';
import { GetAuthUser } from 'src/utils/decorators/get-authenticated-user.decorator';
import { SearchOrderResponse } from 'src/modules/order/responses/search.response';

@ApiTags('Orders')
@Controller({
  version: '1',
  path: 'orders',
})
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Criar um novo pedido',
    description:
      'Cria um novo pedido para o usuário autenticado. Os produtos informados em `items` são associados ao pedido e seus preços são registrados no momento da criação.',
  })
  @ApiCreatedResponse({
    description: 'Pedido criado com sucesso.',
    type: OrderResponse,
  })
  @ApiBadRequestResponse({
    description:
      'Dados da requisição inválidos. Pode ocorrer quando algum campo obrigatório está ausente ou possui formato inválido.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token de autenticação ausente, inválido ou expirado.',
  })
  @ApiNotFoundResponse({
    description:
      'Um ou mais produtos informados no pedido não foram encontrados.',
  })
  createSelf(
    @Body() body: CreateOrderRequest,
    @GetAuthUser() authUser: AuthenticatedUser.Props,
  ) {
    return this.service.create(body, authUser);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar pedidos',
    description:
      'Retorna uma lista paginada de pedidos. Os resultados podem ser filtrados por número do pedido, período de entrega, cliente e status.',
  })
  @ApiOkResponse({
    description: 'Pedidos encontrados com sucesso.',
    type: SearchOrderResponse,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description:
      'Um ou mais parâmetros de consulta possuem formato ou valor inválido.',
  })
  findMany(@Query() query: FindManyOrdersQuery) {
    return this.service.findMany(query);
  }

  @Put(':orderId/confirm')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Confirmar pedido',
    description:
      'Confirma um pedido existente, avançando seu status no fluxo de processamento.',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Identificador único do pedido que será confirmado.',
    example: '550e8400-e29b-41d4-a716-446655440002',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Pedido confirmado com sucesso.',
    type: OrderResponse,
  })
  @ApiBadRequestResponse({
    description: 'O identificador do pedido não possui um UUID válido.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token de autenticação ausente, inválido ou expirado.',
  })
  @ApiNotFoundResponse({
    description: 'Pedido não encontrado.',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'O pedido não pode ser confirmado porque seu status atual não permite essa transição.',
  })
  confirm(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @GetAuthUser() authUser: AuthenticatedUser.Props,
  ) {
    return this.service.confirm(orderId, authUser);
  }

  @Put(':orderId/ship')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Despachar pedido',
    description:
      'Marca o pedido como despachado, avançando seu status no fluxo de entrega.',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Identificador único do pedido que será despachado.',
    example: '550e8400-e29b-41d4-a716-446655440002',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Pedido despachado com sucesso.',
    type: OrderResponse,
  })
  @ApiBadRequestResponse({
    description: 'O identificador do pedido não possui um UUID válido.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token de autenticação ausente, inválido ou expirado.',
  })
  @ApiNotFoundResponse({
    description: 'Pedido não encontrado.',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'O pedido não pode ser despachado porque seu status atual não permite essa transição.',
  })
  ship(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @GetAuthUser() authUser: AuthenticatedUser.Props,
  ) {
    return this.service.ship(orderId, authUser);
  }

  @Put(':orderId/deliver')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Marcar pedido como entregue',
    description:
      'Marca o pedido como entregue, finalizando o fluxo de entrega.',
  })
  @ApiParam({
    name: 'orderId',
    description:
      'Identificador único do pedido que será marcado como entregue.',
    example: '550e8400-e29b-41d4-a716-446655440002',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Pedido marcado como entregue com sucesso.',
    type: OrderResponse,
  })
  @ApiBadRequestResponse({
    description: 'O identificador do pedido não possui um UUID válido.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token de autenticação ausente, inválido ou expirado.',
  })
  @ApiNotFoundResponse({
    description: 'Pedido não encontrado.',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'O pedido não pode ser marcado como entregue porque seu status atual não permite essa transição.',
  })
  deliver(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @GetAuthUser() authUser: AuthenticatedUser.Props,
  ) {
    return this.service.deliver(orderId, authUser);
  }

  @Put(':orderId/cancel')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Cancelar pedido',
    description:
      'Cancela um pedido existente, desde que seu status atual permita o cancelamento.',
  })
  @ApiParam({
    name: 'orderId',
    description: 'Identificador único do pedido que será cancelado.',
    example: '550e8400-e29b-41d4-a716-446655440002',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Pedido cancelado com sucesso.',
    type: OrderResponse,
  })
  @ApiBadRequestResponse({
    description: 'O identificador do pedido não possui um UUID válido.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token de autenticação ausente, inválido ou expirado.',
  })
  @ApiNotFoundResponse({
    description: 'Pedido não encontrado.',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'O pedido não pode ser cancelado porque seu status atual não permite essa transição.',
  })
  cancel(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @GetAuthUser() authUser: AuthenticatedUser.Props,
  ) {
    return this.service.cancel(orderId, authUser);
  }

  @Put(':orderId/update-delivery')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Atualizar dados de entrega do pedido',
    description:
      'Atualiza os dados de entrega de um pedido existente. Somente os campos enviados no corpo da requisição serão alterados.',
  })
  @ApiParam({
    name: 'orderId',
    description:
      'Identificador único do pedido que terá os dados de entrega atualizados.',
    example: '550e8400-e29b-41d4-a716-446655440002',
    type: String,
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Dados de entrega atualizados com sucesso.',
    type: OrderResponse,
  })
  @ApiBadRequestResponse({
    description:
      'O identificador ou algum campo da requisição possui formato ou valor inválido.',
  })
  @ApiUnauthorizedResponse({
    description: 'Token de autenticação ausente, inválido ou expirado.',
  })
  @ApiNotFoundResponse({
    description: 'Pedido não encontrado.',
  })
  @ApiUnprocessableEntityResponse({
    description:
      'Os dados de entrega não podem ser atualizados considerando o status atual do pedido.',
  })
  updateDelivery(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() body: UpdateOrderDeliveryRequest,
    @GetAuthUser() authUser: AuthenticatedUser.Props,
  ) {
    return this.service.updateDelivery(orderId, body, authUser);
  }
}
