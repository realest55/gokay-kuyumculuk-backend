// src/users/schemas/user.schema.ts (DOĞRU VE GÜNCEL HALİ)

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// 'Document' yerine 'HydratedDocument' import ediyoruz.
import { HydratedDocument } from 'mongoose';

// UserDocument tipini bu şekilde tanımlıyoruz. Bu, sorunu çözecektir.
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  hash: string;

  @Prop({ type: String, enum: ['ADMIN', 'USER'], default: 'USER' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);