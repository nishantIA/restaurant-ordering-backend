import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // API Versioning (v1)
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Auto-convert types (string to number, etc.)
      },
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Restaurant Ordering System API')
    .setDescription('Full-stack restaurant ordering platform with real-time tracking')
    .setVersion('1.0')
    .addTag('Menu', 'Menu browsing and search')
    .addTag('Cart', 'Shopping cart operations')
    .addTag('Orders', 'Order placement and tracking')
    .addTag('Kitchen', 'Kitchen dashboard and status updates')
    .addTag('Payments', 'Payment processing')
    .addServer('http://localhost:4000', 'Local Development')
    .addServer('https://restaurant-ordering-backend-production.up.railway.app', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Restaurant API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger API Docs: http://localhost:${port}/api/docs`);
}

bootstrap();