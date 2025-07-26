import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async findAll(): Promise<Product[]> {
    this.logger.log('Ürünler sorgulanıyor...');
    return this.productModel.find().populate('categoryId').exec();
  }

  async findOne(id: string): Promise<Product> {
    this.logger.log(`${id} ID'li ürün aranıyor...`);
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`${id} ID'li ürün bulunamadı.`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    this.logger.log(`${id} ID'li ürün güncelleniyor...`);
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Güncellenecek ürün bulunamadı: ${id}`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    this.logger.log(`${id} ID'li ürün siliniyor...`);
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Silinecek ürün bulunamadı: ${id}`);
    }
    return deletedProduct;
  }
}
