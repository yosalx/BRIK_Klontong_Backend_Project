import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalFilters({
    catch(exception: unknown, host) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();

      if (exception instanceof HttpException) {
        const status = exception.getStatus();
        const message = exception.message;

        response.status(status).json({
          statusCode: status,
          message: message,
        });
      } else if (exception instanceof Error) {
        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        const message = exception.message;

        response.status(status).json({
          statusCode: status,
          message: message,
        });
      }
    },
  });

  await app.listen(3000);
}
bootstrap();
