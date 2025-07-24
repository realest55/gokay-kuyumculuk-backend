import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto'; // DTO yolu güncellendi
import * as argon from 'argon2';
import { Prisma } from '@prisma/client'; // Prisma client tipi eklendi
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Kullanıcı kaydı işlemini yönetir.
   * @param dto - Kayıt için gerekli kullanıcı bilgileri (email, password, name).
   * @returns JWT token ve kullanıcı bilgileri.
   */
  async signup(dto: AuthDto) {
    // Şifreyi hash'le
    const hash = await argon.hash(dto.password);

    try {
      // Yeni kullanıcı oluştur
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash, // 'hash' yerine 'password' kullanıldı
          name: dto.name, // 'name' alanı eklendi
        },
      });

      // Kullanıcının şifresini döndürmemek için object destructuring kullanıldı
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;

      // JWT token oluştur ve döndür
      // result.id ve result.email'in null olmadığını garanti altına alıyoruz
      if (result.id === null || result.email === null) {
        throw new Error('User ID or email cannot be null after user creation.');
      }
      return this.signToken(result.id, result.email);

    } catch (error) {
      // Prisma hata kodlarını kontrol et (daha sağlam kontrol)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // E-posta zaten kayıtlıysa hata fırlat
        throw new ForbiddenException('Credentials taken');
      }
      throw error; // Diğer hataları yeniden fırlat
    }
  }

  /**
   * Kullanıcı giriş işlemini yönetir.
   * @param dto - Giriş için gerekli kullanıcı bilgileri (email, password).
   * @returns JWT token ve kullanıcı bilgileri.
   */
  async signin(dto: AuthDto) {
    // E-posta ile kullanıcıyı bul
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // Kullanıcı yoksa hata fırlat
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // Kullanıcının şifresinin null olup olmadığını kontrol et
    // Normalde bu durum olmamalıdır, çünkü kullanıcı oluşturulurken şifre hashlenir.
    if (user.password === null) { // 'user.hash' yerine 'user.password' kullanıldı
      throw new ForbiddenException('User password not set');
    }

    // Sağlanan şifre ile kayıtlı hashlenmiş şifreyi karşılaştır
    const pwMatches = await argon.verify(user.password, dto.password);

    // Şifreler eşleşmiyorsa hata fırlat
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }

    // Kullanıcının şifresini döndürmemek için object destructuring kullanıldı
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    // JWT token oluştur ve döndür
    // result.id ve result.email'in null olmadığını garanti altına alıyoruz
    if (result.id === null || result.email === null) {
      throw new Error('User ID or email cannot be null for token generation.');
    }
    return this.signToken(result.id, result.email);
  }

  /**
   * JWT token oluşturur.
   * @param userId - Kullanıcı ID'si.
   * @param email - Kullanıcı e-postası.
   * @returns Oluşturulan JWT token.
   */
  async signToken(userId: string, email: string): Promise<{ access_token: string }> {
    // userId ve email'in null olmadığını garanti altına al
    if (userId === null || email === null) {
      throw new Error('User ID or email cannot be null for token generation.');
    }

    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m', // Token geçerlilik süresi
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
