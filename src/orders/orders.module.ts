import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    // PrismaModule yerine MongooseModule.forFeature kullanıyoruz.
    // Bu, Order modelini bu modül içinde kullanılabilir hale getirir.
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    // Not: Customer ve Product modelleri de Mongoose'a taşındığında
    // ve bu serviste kullanılacaksa, onların modüllerini de buraya import etmelisiniz.
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
