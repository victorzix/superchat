import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { IoAdapter } from '@nestjs/platform-socket.io';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  app.enableCors({ origin: true, credentials: true });

  app.setGlobalPrefix(process.env.APP_ROUTE_PREFIX);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Vantagens')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(process.env.SWAGGER_ROUTE_PREFIX, app, document, {
    swaggerOptions: {
      operationsSorter: (a, b) => {
        const methodOrder = { get: 0, post: 1, patch: 2, delete: 3 };

        const methodDiff =
          methodOrder[a.get('method')] - methodOrder[b.get('method')];

        if (methodDiff !== 0) return methodDiff;

        const pathA = a.get('path');
        const pathB = b.get('path');

        return pathA.length - pathB.length || pathA.localeCompare(pathB);
      },
    },
  });

  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);
  await app.listen(port, '0.0.0.0', () => {
    Logger.debug(
      `Servidor rodando em http://localhost:${port}`,
      'ApplicationServer',
    );

    Logger.debug(
      `Documentação rodando em http://localhost:${port}/api/v1/docs`,
      'Swagger',
    );
  });
}

bootstrap();
