import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Bu endpoint, sadece geçerli bir JWT'ye sahip kullanıcıların
  // kendi profil bilgilerini görmesini sağlar.
  // @UseGuards(AuthGuard('jwt')) ifadesi bu endpoint'i koruma altına alır.
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    // req.user, bizim jwt.strategy.ts dosyasındaki validate metodundan geliyor.
    // O metodda kullanıcıyı bulup şifresini çıkardıktan sonra buraya gönderiyoruz.
    return req.user;
  }
}
