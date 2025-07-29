import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { AuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: AuthDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  // DÜZELTME: Giriş işlemi için şifre alanı özel olarak sorguya eklendi (+password).
  // DÜZELTME: Mongoose'dan dönen tip 'null' olabileceğinden, Promise dönüş tipi güncellendi.
  async findOne(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // DÜZELTME: Mongoose'dan dönen tip 'null' olabileceğinden, Promise dönüş tipi güncellendi.
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
