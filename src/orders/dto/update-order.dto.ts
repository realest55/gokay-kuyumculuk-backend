import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { OrderStatus } from '@prisma/client';

/**
 * UpdateOrderDto, bir siparişi güncellerken beklenen veri yapısını tanımlar.
 * PartialType, CreateOrderDto'daki tüm alanları isteğe bağlı hale getirir.
 * Bu sayede, bir siparişi güncellerken tüm alanları göndermek zorunda kalmayız.
 */
export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  // Eğer CreateOrderDto'da olmayan ve sadece güncelleme sırasında gelebilecek
  // ek alanlar varsa buraya eklenebilir.
  // Örneğin, siparişin durumunu doğrudan güncellemek için:

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus; // Sipariş durumu (örneğin: PENDING, SHIPPED, DELIVERED)

  // Eğer totalAmount'ı doğrudan güncellemek isterseniz (genellikle hesaplanır ama bazen manuel müdahale gerekebilir):
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalAmount?: number; // Siparişin toplam tutarı

  // Eğer customerId'yi güncellemek isterseniz (genellikle değişmez ama senaryoya göre eklenebilir):
  @IsOptional()
  @IsString()
  @IsUUID() // UUID formatında olmalı
  customerId?: string; // Siparişin ait olduğu müşteri ID'si
}
