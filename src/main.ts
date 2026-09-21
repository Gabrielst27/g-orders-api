import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { EntityValidationFilter } from 'src/utils/exception-filters/entity-validation.filter.';
import { ForbiddenFilter } from 'src/utils/exception-filters/forbidden.filter';
import { BadRequestFilter } from 'src/utils/exception-filters/bad-request.filter';
import { UnauthorizedFilter } from 'src/utils/exception-filters/unauthorized.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({ type: VersioningType.URI });

  const config = new DocumentBuilder()
    .setTitle('GOrders API')
    .setDescription(
      'API Restful do sistema GOrders, desenvolvida como teste técnico para a empresa NaPorta.',
    )
    .setVersion('1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Informe o token de acesso JWT',
      },
      'access-token',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(
    new EntityValidationFilter(),
    new BadRequestFilter(),
    new UnauthorizedFilter(),
    new ForbiddenFilter(),
  );

  await app.listen(process.env.API_PORT!, '0.0.0.0');
}
bootstrap();
