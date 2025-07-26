import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    this.logger.log(`Yeni ürün oluşturuluyor: ${createProductDto.name}`);
    const newProduct = new this.productModel(createProductDto);
    return newProduct.save();
  }

  // findAll metodu filtreleme ve sıralama parametrelerini kabul edecek şekilde güncellendi.
  async findAll(filters?: { 
    categoryId?: string; 
    maxPrice?: number; 
    freeShipping?: boolean;
    material?: string[];
    stone?: string[];
    metalColor?: string[];
    sortBy?: string;
  }): Promise<Product[]> {
    this.logger.log('Ürünler sorgulanıyor...');
    const query: any = {};

    if (filters?.categoryId && filters.categoryId !== 'all') {
      // Kategori ID'si geçerli bir ObjectId olmalı
      if (!Types.ObjectId.isValid(filters.categoryId)) {
        throw new NotFoundException(`Geçersiz kategori ID formatı: ${filters.categoryId}`);
      }
      query.categoryId = new Types.ObjectId(filters.categoryId);
    }

    if (filters?.maxPrice !== undefined) {
      query.price = { $lte: filters.maxPrice }; // Fiyatı maxPrice'dan küçük veya eşit olanlar
    }

    if (filters?.freeShipping) {
      // Ürünün kargo bedava özelliği varsa (örneğin bir boolean alan olarak tutuluyorsa)
      // Eğer böyle bir alan yoksa, bu filtreyi kaldırabilir veya ekleyebilirsin.
      // Örnek olarak product.schema.ts'de freeShipping adında bir boolean alan olduğunu varsayalım.
      // Şu anki product.schema.ts'de böyle bir alan yok, eklenmesi gerekebilir.
      // Eğer yoksa, bu satırı kaldırın veya schema'ya ekleyin.
      // query.freeShipping = true; 
    }

    // Materyal, Taş, Metal Rengi filtreleri (ürün şemasına eklenmesi gerekir)
    // Eğer product.schema.ts'de bu alanlar yoksa, şemaya eklenmeli
    // Örneğin: @Prop([String]) materials: string[];
    // @Prop([String]) stones: string[];
    // @Prop([String]) metalColors: string[];
    if (filters?.material && filters.material.length > 0) {
      query.material = { $in: filters.material };
    }
    if (filters?.stone && filters.stone.length > 0) {
      query.stone = { $in: filters.stone };
    }
    if (filters?.metalColor && filters.metalColor.length > 0) {
      query.metalColor = { $in: filters.metalColor };
    }

    let findQuery = this.productModel.find(query).populate('categoryId'); // Kategori bilgilerini de çek

    // Sıralama mantığı
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          findQuery = findQuery.sort({ price: 1 }); // Fiyata göre artan
          break;
        case 'price-desc':
          findQuery = findQuery.sort({ price: -1 }); // Fiyata göre azalan
          break;
        case 'name-asc':
          findQuery = findQuery.sort({ name: 1 }); // İsme göre artan (A-Z)
          break;
        case 'name-desc':
          findQuery = findQuery.sort({ name: -1 }); // İsme göre azalan (Z-A)
          break;
        default:
          // Varsayılan sıralama
          findQuery = findQuery.sort({ createdAt: -1 });
          break;
      }
    } else {
        // Varsayılan olarak eklenme tarihine göre sırala
        findQuery = findQuery.sort({ createdAt: -1 });
    }

    const products = await findQuery.exec();
    this.logger.log(`${products.length} adet ürün bulundu.`);
    return products;
  }

  async findOne(id: string): Promise<Product> {
    this.logger.log(`${id} ID'li ürün aranıyor...`);
    // ID'nin geçerli bir MongoDB ObjectId olup olmadığını kontrol et
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Geçersiz ürün ID formatı: ${id}`);
    }
    const product = await this.productModel.findById(id).populate('categoryId').exec();
    if (!product) {
      throw new NotFoundException(`${id} ID'li ürün bulunamadı.`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    this.logger.log(`${id} ID'li ürün güncelleniyor...`);
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Geçersiz ürün ID formatı: ${id}`);
    }
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Güncellenecek ürün bulunamadı: ${id}`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    this.logger.log(`${id} ID'li ürün siliniyor...`);
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Geçersiz ürün ID formatı: ${id}`);
    }
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Silinecek ürün bulunamadı: ${id}`);
    }
    return deletedProduct;
  }
}
