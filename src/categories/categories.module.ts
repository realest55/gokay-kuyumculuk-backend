// src/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../prisma/prisma.service'; // Eklendi

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService], // PrismaService eklendi
})
export class CategoriesModule {}

