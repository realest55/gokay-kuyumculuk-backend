import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
// HATA ÇÖZÜMÜ 1. ADIM:
// User'ın tüm Mongoose özelliklerini içeren UserDocument tipini import ediyoruz.
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    try {
      // HATA ÇÖZÜMÜ 2. ADIM:
      // 'user' değişkeninin tipini açıkça UserDocument olarak belirtiyoruz.
      const user: UserDocument = await this.usersService.create(dto, hash);
      return this.signToken(user._id.toString(), user.email, user.role);
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException('Credentials taken');
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // HATA ÇÖZÜMÜ 3. ADIM:
    // 'user' değişkeninin tipini açıkça UserDocument olarak belirtiyoruz.
    const user: UserDocument | null = await this.usersService.findOneByEmail(
      dto.email,
    );
    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await bcrypt.compare(dto.password, user.hash);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user._id.toString(), user.email, user.role);
  }

  async signToken(
    userId: string,
    email: string,
    role: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      role,
    };
    const secret = this.configService.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '60m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
