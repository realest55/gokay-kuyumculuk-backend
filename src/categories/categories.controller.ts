// src/categories/categories.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories') // Tüm endpoint'lerin /categories ile başlayacağını belirtir.
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get() // GET /categories isteğini karşılar.
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post() // POST /categories isteğini karşılar.
  create(@Body() createCategoryDto: { name: string }) {
    return this.categoriesService.create(createCategoryDto);
  }
}