import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  // YENİ: Ürün oluşturma metodu
  async create(createProductDto: CreateProductDto) {
    this.logger.log(`Yeni ürün oluşturuluyor: ${createProductDto.name}`);
    try {
      const newProduct = await this.prisma.product.create({
        data: createProductDto,
      });
      return newProduct;
    } catch (error) {
      this.logger.error(`Ürün oluşturulurken hata: ${error.message}`, error.stack);
      // Hata detayını daha iyi anlamak için fırlatıyoruz.
      throw error;
    }
  }

  // Mevcut ürün listeleme metodu
  async findAll() {
    try {
      this.logger.log('Ürünler sorgulanıyor...');
      const products = await this.prisma.product.findMany({
        include: {
          category: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
      this.logger.log(`${products.length} adet ürün bulundu.`);
      return products;
    } catch (error) {
      this.logger.error('Ürünleri çekerken bir hata oluştu:', error.stack);
      return [];
    }
  }

  // YENİ: Tek bir ürünü ID ile bulma metodu
  async findOne(id: string) {
    this.logger.log(`${id} ID'li ürün aranıyor...`);
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      throw new NotFoundException(`${id} ID'li ürün bulunamadı.`);
    }
    return product;
  }

  // YENİ: Ürün güncelleme metodu
  async update(id: string, updateProductDto: UpdateProductDto) {
    this.logger.log(`${id} ID'li ürün güncelleniyor...`);
    try {
      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      // Prisma'nın P2025 hatası (kayıt bulunamadı) için özel kontrol
      if (error.code === 'P2025') {
        throw new NotFoundException(`Güncellenecek ürün bulunamadı: ${id}`);
      }
      this.logger.error(`Ürün güncellenirken hata: ${error.message}`, error.stack);
      throw error;
    }
  }

  // YENİ: Ürün silme metodu
  async remove(id: string) {
    this.logger.log(`${id} ID'li ürün siliniyor...`);
    try {
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Silinecek ürün bulunamadı: ${id}`);
      }
      this.logger.error(`Ürün silinirken hata: ${error.message}`, error.stack);
      throw error;
    }
  }
}
