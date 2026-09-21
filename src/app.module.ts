import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './modules/shared/shared.module';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SharedModule,
    AuthenticationModule,
    OrderModule,
    ProductModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
