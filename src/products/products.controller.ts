import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Types } from 'mongoose'; // MongoDB ObjectId doğrulaması için

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // findAll metodu filtreleme ve sıralama parametrelerini kabul edecek şekilde güncellendi.
  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('maxPrice') maxPrice?: number,
    @Query('freeShipping') freeShipping?: string,
    @Query('material') material?: string[], // Birden fazla materyal olabilir
    @Query('stone') stone?: string[],       // Birden fazla taş olabilir
    @Query('metalColor') metalColor?: string[], // Birden fazla metal rengi olabilir
    @Query('sortBy') sortBy?: string, // Sıralama kriteri (örn: price-asc, price-desc, name-asc, name-desc)
  ) {
    // Query parametrelerini ProductsService'e aktar
    const filters = {
      categoryId: categoryId,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      freeShipping: freeShipping === 'true', // 'true' stringini boolean'a çevir
      material: material,
      stone: stone,
      metalColor: metalColor,
      sortBy: sortBy,
    };
    return this.productsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) { // ParseUUIDPipe kaldırıldı
    // ID'nin geçerli bir MongoDB ObjectId olup olmadığını kontrol et
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Geçersiz ürün ID formatı: ${id}`);
    }
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) { // ParseUUIDPipe kaldırıldı
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Geçersiz ürün ID formatı: ${id}`);
    }
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) { // ParseUUIDPipe kaldırıldı
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Geçersiz ürün ID formatı: ${id}`);
    }
    return this.productsService.remove(id);
  }
}
