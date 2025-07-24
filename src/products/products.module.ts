// src/products/products.module.ts
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service'; // Eklendi

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService], // PrismaService eklendi
})
export class ProductsModule {}
