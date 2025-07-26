import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';

// Sipariş içindeki tek bir ürünü temsil eden alt şema (subdocument)
@Schema({ _id: false }) // Alt dokümanlar için ayrı bir _id oluşturma
export class OrderItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  product: Product; // 'productId' yerine doğrudan 'product' referansı

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// Ana Sipariş Şeması
@Schema({ timestamps: true }) // createdAt ve updatedAt alanlarını otomatik ekler
export class Order extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User; // 'userId' yerine doğrudan 'user' referansı

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  total: number;

  @Prop({ type: String, default: 'Pending' })
  status: string; // Örn: 'Pending', 'Completed', 'Cancelled'
}

export const OrderSchema = SchemaFactory.createForClass(Order);
