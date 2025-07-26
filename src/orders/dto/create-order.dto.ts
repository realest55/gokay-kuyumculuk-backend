import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsMongoId, // Mongoose için MongoId doğrulaması eklendi
  Min,
  ValidateNested,
} from 'class-validator';

/**
 * Siparişteki her bir kalemin yapısını tanımlar.
 */
class OrderItemDto {
  // Mongoose ObjectId'leri string olduğu için tip ve doğrulama güncellendi.
  @IsString()
  @IsMongoId({ message: 'Product ID must be a valid Mongo ObjectId' })
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

/**
 * Yeni bir sipariş oluşturmak için gereken verileri tanımlar.
 */
export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty()
  items: OrderItemDto[];

  @IsNumber()
  @IsNotEmpty()
  total: number;
}
