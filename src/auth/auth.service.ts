import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(authDto: AuthDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(authDto.email);
    
    // DÜZELTME: user.password artık `findOne` metodunda `select('+password')` kullanıldığı için erişilebilir.
    if (!user || !(await bcrypt.compare(authDto.password, user.password))) {
      throw new UnauthorizedException('Geçersiz kimlik bilgileri');
    }
    const payload = { sub: user._id, username: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(authDto: AuthDto) {
    if (!authDto.name) {
        throw new BadRequestException('İsim alanı zorunludur.');
    }
    const hashedPassword = await bcrypt.hash(authDto.password, 10);
    const newUser = await this.usersService.create({
      ...authDto,
      password: hashedPassword,
    });
    
    // DÜZELTME: Dönen yanıttan parolayı güvenli bir şekilde kaldırıyoruz.
    const userObject = newUser.toObject();
    delete userObject.password;
    return userObject;
  }
}
