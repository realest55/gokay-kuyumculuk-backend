import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!jwtSecret) {
      // Bu kontrol, .env dosyasında JWT_SECRET'ın unutulması durumunda
      // uygulamanın çökerek bizi uyarmasını sağlar. Bu, önemli bir güvenlik adımıdır.
      throw new Error('JWT_SECRET environment variable is not defined!');
    }

    super({
      // Gelen isteğin Authorization header'ındaki Bearer token'ı okur
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Token'ın süresinin dolup dolmadığını kontrol eder
      ignoreExpiration: false,
      // Token'ı imzalamak için kullandığımız gizli anahtar
      secretOrKey: jwtSecret,
    });
  }

  /**
   * JWT doğrulandıktan sonra bu metod çalışır.
   * Gelen payload'daki kullanıcı ID'si ile veritabanından kullanıcıyı bulur.
   * @param payload JWT içinden çözülen veri (örn: { sub: userId, email: userEmail })
   * @returns Kullanıcı nesnesini (şifre hariç) request objesine ekler (request.user).
   */
  async validate(payload: { sub: string; email: string }): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or token is invalid.');
    }

    // Güvenlik için şifre alanını geri dönen nesneden çıkarıyoruz
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
