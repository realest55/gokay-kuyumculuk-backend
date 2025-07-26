  // src/users/users.service.ts (Düzeltilmiş Hali)

  import { Injectable } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  // HydratedDocument yerine UserDocument'ı import ediyoruz.
  import { User, UserDocument } from './schemas/user.schema'; 
  import { AuthDto } from 'src/auth/dto/auth.dto';

  @Injectable()
  export class UsersService {
    // Modelimizi de UserDocument ile tiplemek daha tutarlı olacaktır.
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    // Dönüş tipini UserDocument olarak değiştiriyoruz.
    async create(dto: AuthDto, hash: string): Promise<UserDocument> {
      const newUser = new this.userModel({
        email: dto.email,
        hash: hash,
      });
      return newUser.save();
    }

    // Dönüş tipini UserDocument | null olarak değiştiriyoruz.
    async findOneByEmail(email: string): Promise<UserDocument | null> {
      return this.userModel.findOne({ email: email }).exec();
    }
  }