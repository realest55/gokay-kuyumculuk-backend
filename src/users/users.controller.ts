import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Bu endpoint, sadece geçerli bir JWT'ye sahip kullanıcıların
  // kendi profil bilgilerini görmesini sağlar.
  @UseGuards(AuthGuard('jwt'))
  @Get('profile') // Frontend'in beklediği endpoint adı
  getProfile(@Request() req) {
    // req.user, bizim jwt.strategy.ts dosyasındaki validate metodundan geliyor.
    // O metodda kullanıcıyı bulup şifresini çıkardıktan sonra buraya gönderiyoruz.
    // Frontend'e sadece gerekli bilgileri döndür.
    const { _id, email, role, name } = req.user;
    return { id: _id, email, role, name }; // name alanı da eklendi
  }

  // Admin panelinin tüm kullanıcıları listelemesi için bu endpoint'i eklemiyoruz
  // çünkü şimdilik admin paneline dokunmuyoruz.
  // Eğer admin paneli için tüm kullanıcıları listeleme ihtiyacı olursa,
  // buraya @UseGuards(AuthGuard('jwt'), RolesGuard) ve @Roles('ADMIN') ile bir endpoint eklenebilir.
}
