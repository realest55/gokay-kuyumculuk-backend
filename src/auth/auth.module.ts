import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    // Dairesel bağımlılığı çözmek için forwardRef kullanıyoruz.
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  // --- DEĞİŞİKLİK BURADA ---
  // JwtStrategy'yi, UsersModule'deki Guard'ların kullanabilmesi için export ediyoruz.
  exports: [JwtStrategy, JwtModule],
})
export class AuthModule {}
