import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { EntityValidationFilter } from 'src/utils/exception-filters/entity-validation.filter.';
import { ForbiddenFilter } from 'src/utils/exception-filters/forbidden.filter';
import { BadRequestFilter } from 'src/utils/exception-filters/bad-request.filter';
import { UnauthorizedFilter } from 'src/utils/exception-filters/unauthorized.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({ type: VersioningType.URI });

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

  await app.listen(process.env.API_PORT!);
}
bootstrap();
