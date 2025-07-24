import { Controller, Get, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Eğer yetkilendirme gerekiyorsa

@Controller('orders') // Bu controller'ın /orders yolunu dinlemesini sağlar
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // @UseGuards(JwtAuthGuard) // Bu satırı aktif ederek bu endpoint'i sadece giriş yapmış kullanıcıların görmesini sağlayabilirsiniz.
  @Get() // GET /orders isteği geldiğinde bu metod çalışır.
  findAll() {
    // Service'deki findAll metodunu çağırır ve sonucu otomatik olarak JSON formatında döndürür.
    return this.ordersService.findAll();
  }

  // Diğer controller metodlarınız (findOne, create vb.) burada yer alabilir.
}
