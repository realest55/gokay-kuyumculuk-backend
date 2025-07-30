import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthService } from '../auth/auth.service';
// HATA DÜZELTİLDİ: Artık 'AuthDto' yerine doğru sınıf olan 'SignUpDto' import ediliyor.
import { SignUpDto } from '../auth/dto/signup-auth.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // HATA DÜZELTİLDİ: Parametre tipi 'AuthDto' yerine 'SignUpDto' olarak güncellendi.
  create(@Body() createUserDto: SignUpDto) {
    return this.authService.signUp(createUserDto);
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
