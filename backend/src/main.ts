import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // Set global prefix untuk semua API routes
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: configService.get<string>('cors.origin'),
    credentials: true,
  });
  
  await app.listen(3000);
  console.log('🚀 Server: http://localhost:3000');
  console.log('🎮 GraphQL: http://localhost:3000/graphql');
  console.log(`📊 Environment: ${configService.get<string>('nodeEnv')}`);
}
bootstrap();
