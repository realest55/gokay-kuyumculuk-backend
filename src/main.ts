import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS (Cross-Origin Resource Sharing) aktif etme
  app.enableCors();
  
  // ----> EKLENECEK SATIR <----
  // Tüm rotaların başına 'api' önekini ekler.
  // Frontend'in http://localhost:3001/api/products/123 gibi
  // istekleri artık doğru şekilde çalışacaktır.
  app.setGlobalPrefix('api');

  // Gelen isteklerde DTO validasyonlarını otomatik olarak etkinleştirir.
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3001);
}
bootstrap();