  // src/users/users.service.ts

  import { Injectable } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { User, UserDocument } from './schemas/user.schema'; 
  import { AuthDto } from 'src/auth/dto/auth.dto';

  @Injectable()
  export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(dto: AuthDto, hash: string): Promise<UserDocument> {
      const newUser = new this.userModel({
        email: dto.email,
        hash: hash,
        name: dto.name,
      });
      return newUser.save();
    }

    async findOneByEmail(email: string): Promise<UserDocument | null> {
      return this.userModel.findOne({ email: email }).exec();
    }

    // Yeni eklenen metot: Tüm kullanıcıları getirir
    async findAllUsers(): Promise<UserDocument[]> {
      return this.userModel.find().exec();
    }
  }
