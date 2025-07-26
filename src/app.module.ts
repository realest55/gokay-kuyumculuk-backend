import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // .env dosyasını global olarak erişilebilir yapar
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DATABASE_URL');
        
        // --- HATA AYIKLAMA ADIMI ---
        // Sunucu başladığında hangi veritabanı adresini kullandığını terminalde görelim.
        console.log('--- Veritabanına Bağlanılıyor ---');
        console.log('Kullanılan URI:', uri);
        console.log('---------------------------------');

        // Eğer .env dosyasından adres okunamadıysa, hata vererek sunucuyu durdur.
        if (!uri) {
          throw new Error('DATABASE_URL .env dosyasında bulunamadı veya okunamadı!');
        }
        
        return {
          uri: uri,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
