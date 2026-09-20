import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { AuthenticatedUser } from 'src/domain/auth/models/authenticated-user.model';
import { AuthenticationGuard } from 'src/modules/authentication/guards/authentication.guard';
import { OrderService } from 'src/modules/order/order.service';
import { CreateOrderRequest } from 'src/modules/order/requests/create.request';
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
}
