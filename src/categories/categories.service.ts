// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Tüm kategorileri getiren method
  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  // Yeni bir kategori oluşturan method
  async create(data: { name: string }): Promise<Category> {
    return this.prisma.category.create({
      data,
    });
  }
}