import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from './schemas/cart.schema';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    ProductsModule, // CartService, ProductService'e bağımlı olabilir
  ],
  controllers: [CartController],
  providers: [CartService],
  // CartModel'i enjekte etmek isteyen diğer modüller için MongooseModule'ü export ediyoruz
  exports: [MongooseModule],
})
export class CartModule {}
