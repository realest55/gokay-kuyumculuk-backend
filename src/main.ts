import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- ÇÖZÜM ---
  // CORS'u etkinleştiriyoruz. Bu satır, frontend'in (localhost:3001)
  // backend'e (localhost:3000) istek atmasına izin verir.
  app.enableCors();

  await app.listen(3001);
}
bootstrap();
