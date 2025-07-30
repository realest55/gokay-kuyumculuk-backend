import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  // DÜZELTME: 'name' alanı şemaya eklendi.
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  // DÜZELTME: Şifre alanı seçilmedikçe sorgularda gelmemesi için select: false eklendi.
  @Prop({ required: true, select: false })
  hash: string;

  @Prop({ type: String, enum: ['ADMIN', 'USER'], default: 'USER' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
