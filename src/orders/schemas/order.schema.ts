import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

// Siparişteki her bir ürünü temsil eden alt şema (subdocument)
@Schema({ _id: false }) // Alt dökümanlar için ayrı bir _id oluşturulmasını engeller
export class OrderItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number; // Sipariş anındaki fiyat
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);


// Ana sipariş şeması
export type OrderDocument = Order & Document;

@Schema({ timestamps: true }) // createdAt ve updatedAt alanlarını otomatik ekler
export class Order {
  // Prisma şemasındaki Customer modeline referans veriyoruz.
  // Mongoose'da model isimleri büyük harfle başlar.
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ default: Date.now })
  orderDate: Date;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    required: true,
    enum: ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: string;

  @Prop({ type: [OrderItemSchema], default: [] })
  items: OrderItem[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
