import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard'; // RolesGuard'ı import et
import { Roles } from '../auth/roles.decorator'; // Roles decorator'ı import et

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Kullanıcının kendi profil bilgilerini getirir (Admin panelinde /users/me olarak çağrılıyor)
  @UseGuards(AuthGuard('jwt'))
  @Get('me') // Endpoint /users/me olarak değiştirildi
  getProfile(@Request() req) {
    const { _id, email, role, name } = req.user;
    return { id: _id, email, role, name };
  }

  // Tüm kullanıcıları listeler (Sadece ADMIN rolüne sahip kullanıcılar erişebilir)
  @UseGuards(AuthGuard('jwt'), RolesGuard) // JWT doğrulamasından sonra rol kontrolü yapılır
  @Roles('ADMIN') // Sadece ADMIN rolüne sahip kullanıcılar erişebilir
  @Get() // Endpoint /users olarak tanımlandı
  findAllUsers() {
    return this.usersService.findAllUsers(); // Yeni metodu çağırıyoruz
  }
}
