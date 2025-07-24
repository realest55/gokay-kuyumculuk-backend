import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller'; // <-- YOL DÜZELTİLDİ
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule), // Dairesel bağımlılık çözümü
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // UsersService'i dışarıya açıyoruz
})
export class UsersModule {}
