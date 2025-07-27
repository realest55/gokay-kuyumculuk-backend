import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS (Cross-Origin Resource Sharing) Ayarını Etkinleştirme
  // Bu satır, frontend (React admin paneli gibi) uygulamanızın 
  // backend sunucusuna istek göndermesine izin verir.
  // Bu olmadan, tarayıcı güvenlik nedeniyle istekleri engeller.
  app.enableCors();

  await app.listen(3000);
  console.log(`Uygulama http://localhost:3000 adresinde çalışıyor`);
}
bootstrap();