import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop()
  image1?: string;

  @Prop()
  image2?: string;

  // Yeni eklenen alanlar
  @Prop([String]) // Malzeme türlerini tutacak bir string dizisi
  material?: string[];

  @Prop([String]) // Taş türlerini tutacak bir string dizisi
  stone?: string[];

  @Prop([String]) // Metal renklerini tutacak bir string dizisi
  metalColor?: string[];

  @Prop({ default: false }) // Kargo bedava olup olmadığını belirten boolean
  freeShipping?: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
