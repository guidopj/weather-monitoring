import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// sin estos DNS la conexión con mongo atlas no me funciona
import dns from 'dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);   // ← Force reliable DNS (Cloudflare + Google)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Weather API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}

bootstrap();