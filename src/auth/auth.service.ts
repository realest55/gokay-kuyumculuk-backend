import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    // PrismaService yerine Mongoose User Model'i inject edildi.
    @InjectModel(User.name) private userModel: Model<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * YENİ KULLANICI OLUŞTURMA (SIGNUP) - Mongoose Versiyonu
   */
  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    
    try {
      const createdUser = new this.userModel({
        email: dto.email,
        name: dto.name,
        hash: hash,
      });
      const user = await createdUser.save();
      
      return this.signToken(user.id, user.email);
    } catch (error) {
      // MongoDB'nin duplicate key hatası (kod 11000)
      if (error.code === 11000) {
        throw new ForbiddenException('Bu email adresi zaten kullanılıyor.');
      }
      throw error;
    }
  }

  /**
   * KULLANICI GİRİŞİ (SIGNIN) - Mongoose Versiyonu
   */
  async signin(dto: AuthDto) {
    const user = await this.userModel.findOne({ email: dto.email }).exec();

    if (!user) {
      throw new ForbiddenException('Kimlik bilgileri yanlış');
    }

    const pwMatches = await argon.verify(user.hash, dto.password);

    if (!pwMatches) {
      throw new ForbiddenException('Kimlik bilgileri yanlış');
    }

    return this.signToken(user.id, user.email);
  }

  // Token oluşturma yardımcı fonksiyonu (Bu kısım aynı kalıyor)
  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}