import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  // PrismaService yerine Mongoose Order modelini enjekte ediyoruz.
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  /**
   * Tüm siparişleri getirir.
   */
  async findAll() {
    this.logger.log('Siparişler sorgulanıyor...');
    // `populate` ile customerId üzerinden customer bilgilerini çekebiliriz.
    // Bunun çalışması için Customer modelinin de Mongoose'a taşınması gerekir.
    const orders = await this.orderModel.find().populate('customerId').exec();
    this.logger.log(`${orders.length} adet sipariş bulundu.`);
    return orders;
  }

  /**
   * Belirli bir siparişi ID'ye göre getirir.
   */
  async findOneOrder(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Geçersiz ID formatı: ${id}`);
    }
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Sipariş bulunamadı: ID ${id}`);
    }
    return order;
  }

  /**
   * Yeni bir sipariş oluşturur.
   */
  async createOrder(createOrderDto: CreateOrderDto) {
    this.logger.log(`Yeni sipariş oluşturuluyor...`);
    // Not: Bu kısım, `Products` ve `Customers` servislerinin de Mongoose'a
    // taşındığını varsayarak basitleştirilmiştir.
    // Gerçek bir senaryoda, ürün fiyatları ve stok durumu kontrol edilerek
    // totalAmount hesaplanmalıdır.

    const newOrder = new this.orderModel({
      ...createOrderDto,
      totalAmount: 0, // Geçici olarak, gerçek hesaplama eklenmeli.
    });

    const savedOrder = await newOrder.save();
    this.logger.log(`Yeni sipariş başarıyla oluşturuldu: ID ${savedOrder._id}`);
    return savedOrder;
  }

  /**
   * Belirli bir siparişi günceller.
   */
  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    this.logger.log(`Sipariş güncelleniyor: ID ${id}`);
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      updateOrderDto,
      { new: true }, // Güncellenmiş dökümanı döndürür
    ).exec();

    if (!updatedOrder) {
      throw new NotFoundException(`Güncellenecek sipariş bulunamadı: ID ${id}`);
    }
    this.logger.log(`Sipariş başarıyla güncellendi: ID ${updatedOrder._id}`);
    return updatedOrder;
  }

  /**
   * Belirli bir siparişi siler.
   */
  async removeOrder(id: string) {
    this.logger.log(`Sipariş siliniyor: ID ${id}`);
    const result = await this.orderModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Silinecek sipariş bulunamadı: ID ${id}`);
    }
    this.logger.log(`Sipariş başarıyla silindi: ID ${id}`);
    return { message: `Sipariş başarıyla silindi: ID ${id}` };
  }
}
