import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // AuthModule'ü, UsersController'daki Guard'lar için import ediyoruz.
    // Dairesel bağımlılığı çözmek için forwardRef kullanıyoruz.
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  // MongooseModule'ü, User modelini başka modüllerin kullanabilmesi için export ediyoruz.
  exports: [MongooseModule],
})
export class UsersModule {}
