import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Genel DTO (Data Transfer Object) validasyonunu etkinleştirir.
  app.useGlobalPipes(new ValidationPipe());

  // --- GÜNCELLEMİŞ CORS YAPILANDIRMASI ---
  // Frontend uygulamasının adresinden (origin) gelen isteklere,
  // belirli metodlarla (GET, POST, vb.) ve özel başlıklarla (Authorization)
  // izin vermek için daha detaylı bir yapılandırma eklendi.
  app.enableCors({
    // DİKKAT: Bu yapılandırma sadece GELİŞTİRME ORTAMI İÇİNDİR.
    // '*' kullanımı, herhangi bir kaynaktan gelen isteklere izin verir.
    // ÜRETİM ORTAMINDA KESİNLİKLE KULLANILMAMALIDIR!
    // Üretimde, frontend uygulamanın kesin adresini/adreslerini belirtmelisin.
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Eğer kimlik doğrulama (çerezler, yetkilendirme başlıkları) kullanıyorsan
  });

  // Uygulamayı 3001 portunda dinlemeye başlar.
  await app.listen(3001);
}
bootstrap();
