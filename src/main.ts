import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const appConfig = app.get<AppConfigService>(AppConfigService);

  const PORT = appConfig.port;

  app.setGlobalPrefix('api');

  await app.listen(PORT);
}
bootstrap();
