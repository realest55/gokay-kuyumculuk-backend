import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

// Siparişteki her bir ürünü temsil eden alt DTO
class OrderItemDto {
  @IsMongoId() // Ürün ID'sinin geçerli bir MongoDB ObjectId olmasını sağlıyoruz.
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

// Ana sipariş oluşturma DTO'su
export class CreateOrderDto {
  @IsMongoId() // Müşteri ID'sinin geçerli bir MongoDB ObjectId olmasını sağlıyoruz.
  @IsNotEmpty() // Boş olmamasını sağlıyoruz.
  customerId: string; // Müşteri ID'si eklendi

  @IsArray()
  @ValidateNested({ each: true }) // Dizideki her bir objenin de doğrulanmasını sağlar.
  @Type(() => OrderItemDto) // Gelen objeleri OrderItemDto class'ına dönüştürür.
  items: OrderItemDto[];
}
