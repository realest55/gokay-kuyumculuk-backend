import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    // Bu metodun http://localhost:3000/ adresine gelen isteği karşılaması gerekir.
    return this.appService.getHello();
  }

  @Get('ping') // YENİ TEST YOLU
  ping(): string {
    // Bu metodun http://localhost:3000/ping adresine gelen isteği karşılaması gerekir.
    return 'Pong! Backend ayakta ve çalışıyor.';
  }
}
