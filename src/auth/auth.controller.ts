import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    // DÜZELTME: Metod adı 'signUp' olarak düzeltildi.
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    // DÜZELTME: Metod adı 'signIn' olarak düzeltildi.
    return this.authService.signIn(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
