import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// --- DEĞİŞİKLİK 1: Mongoose ve User modeli import edildi ---
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    // --- DEĞİŞİKLİK 2: PrismaService yerine UserModel inject edildi ---
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    // --- DEĞİŞİKLİK 3: Kullanıcı artık Prisma ile değil, Mongoose ile bulunuyor ---
    const user = await this.userModel.findById(payload.sub);
    
    // Kullanıcıdan hash'i kaldırarak güvenliği artırıyoruz.
    if (user) {
      const { hash, ...result } = user.toObject();
      return result;
    }
    
    return null;
  }
}
