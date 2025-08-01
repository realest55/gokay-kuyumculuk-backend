import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { SignUpDto } from './dto/signup-auth.dto';
import { SignInDto } from './dto/signin-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(signInDto.email);

    if (!user || !(await argon2.verify(user.hash, signInDto.password))) {
      throw new UnauthorizedException('Geçersiz kimlik bilgileri');
    }

    const payload = { sub: user._id, username: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const hashedPassword = await argon2.hash(signUpDto.password);

    const { password, ...userData } = signUpDto;
    const newUser = await this.usersService.create({
      ...userData,
      hash: hashedPassword,
    });

    const { hash, ...result } = newUser.toObject();
    return result;
  }
}