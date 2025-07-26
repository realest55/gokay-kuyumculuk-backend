import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Genel DTO (Data Transfer Object) validasyonunu etkinleştirir.
  app.useGlobalPipes(new ValidationPipe());

  // --- GÜNCELLENMİŞ CORS YAPILANDIRMASI ---
  // Frontend uygulamasının adresinden (origin) gelen isteklere,
  // belirli metodlarla (GET, POST, vb.) ve özel başlıklarla (Authorization)
  // izin vermek için daha detaylı bir yapılandırma eklendi.
  app.enableCors({
    // Frontend'in çalıştığı gerçek adresi buraya ekliyoruz.
    // Eğer frontend 127.0.0.1:5500'de çalışıyorsa, onu da eklemeliyiz.
    // Geliştirme ortamında birden fazla adrese izin vermek için bir dizi kullanabiliriz.
    // VEYA, sadece geliştirme için, tüm origin'lere izin vermek üzere '*' kullanabiliriz.
    // Ancak '*' KESİNLİKLE ÜRETİM ORTAMINDA KULLANILMAMALIDIR.
    origin: ['http://localhost:5173', 'http://127.0.0.1:5500', 'http://localhost:5500'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Uygulamayı 3001 portunda dinlemeye başlar.
  await app.listen(3001);
}
bootstrap();
