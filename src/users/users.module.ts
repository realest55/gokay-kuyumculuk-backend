import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    // User modelini ve şemasını Mongoose'a tanıtıyoruz.
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  // UsersService'i diğer modüllerin (özellikle AuthModule) kullanabilmesi için export ediyoruz.
  exports: [UsersService],
})
export class UsersModule {}
