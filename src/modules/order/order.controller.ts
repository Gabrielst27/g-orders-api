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
import type { AuthenticatedUser } from 'src/domain/auth/models/authenticated-user.model';
import { AuthenticationGuard } from 'src/modules/authentication/guards/authentication.guard';
import { OrderService } from 'src/modules/order/order.service';
import { CreateOrderRequest } from 'src/modules/order/requests/create.request';
import { FindManyOrdersQuery } from 'src/modules/order/requests/find-many.request';
import { UpdateOrderDeliveryRequest } from 'src/modules/order/requests/update-delivery.request';
import { GetAuthUser } from 'src/utils/decorators/get-authenticated-user.decorator';

@Controller({
  version: '1',
  path: 'orders',
})
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthenticationGuard)
  createSelf(
    @Body() body: CreateOrderRequest,
    @GetAuthUser() authUser: AuthenticatedUser.Props,
  ) {
    return this.service.create(body, authUser);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findMany(@Query() query: FindManyOrdersQuery) {
    return this.service.findMany(query);
  }

  @Put(':orderId/confirm')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  confirm(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @GetAuthUser() authUser: AuthenticatedUser.Props,
  ) {
    return this.service.confirm(orderId, authUser);
  }

  @Put(':orderId/ship')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  ship(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @GetAuthUser() authUser: AuthenticatedUser.Props,
  ) {
    return this.service.ship(orderId, authUser);
  }

  @Put(':orderId/deliver')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  deliver(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @GetAuthUser() authUser: AuthenticatedUser.Props,
  ) {
    return this.service.deliver(orderId, authUser);
  }

  @Put(':orderId/cancel')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  cancel(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @GetAuthUser() authUser: AuthenticatedUser.Props,
  ) {
    return this.service.cancel(orderId, authUser);
  }

  @Put(':orderId/update-delivery')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthenticationGuard)
  updateDelivery(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() body: UpdateOrderDeliveryRequest,
    @GetAuthUser() authUser: AuthenticatedUser.Props,
  ) {
    return this.service.updateDelivery(orderId, body, authUser);
  }
}
