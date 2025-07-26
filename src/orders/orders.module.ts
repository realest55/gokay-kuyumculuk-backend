import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module'; // ProductsModule import edildi
import { CartModule } from '../cart/cart.module'; // CartModule import edildi

@Module({
  imports: [
    // OrdersModule'ün kendi kullanacağı modeli tanımlıyoruz
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    // Bağımlı olduğumuz diğer modülleri import ediyoruz
    ProductsModule,
    CartModule,
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
