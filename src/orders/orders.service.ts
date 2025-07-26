import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from '../products/schemas/product.schema';
import { Cart } from '../cart/schemas/cart.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    // Sipariş sonrası sepeti temizlemek için Cart modelini de enjekte ediyoruz.
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const { items } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Sipariş en az bir ürün içermelidir.');
    }

    // Ürünlerin veritabanında var olup olmadığını kontrol et
    for (const item of items) {
      const product = await this.productModel.findById(item.productId);
      if (!product) {
        throw new NotFoundException(`ID'si ${item.productId} olan ürün bulunamadı.`);
      }
    }

    // Yeni siparişi oluştur
    const newOrder = new this.orderModel({
      ...createOrderDto,
      user: userId, // DTO'dan gelen veriler ve kullanıcı ID'si ile doldur
    });

    const savedOrder = await newOrder.save();

    // Sipariş oluşturulduktan sonra kullanıcının sepetini temizle
    await this.cartModel.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    // Oluşturulan siparişi, kullanıcı ve ürün detaylarıyla birlikte döndür
    return savedOrder.populate([
      { path: 'items.product', model: 'Product' },
      { path: 'user', select: 'name email' },
    ]);
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getOrdersForUser(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('user', 'name email')
      .populate('items.product')
      .exec();

    if (!order) {
      throw new NotFoundException(`ID'si ${id} olan sipariş bulunamadı.`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const existingOrder = await this.orderModel.findByIdAndUpdate(
      id,
      updateOrderDto,
      { new: true },
    );

    if (!existingOrder) {
      throw new NotFoundException(`ID'si ${id} olan sipariş bulunamadı.`);
    }
    return existingOrder;
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.orderModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(`ID'si ${id} olan sipariş bulunamadı.`);
    }
    return { deleted: true, id };
  }
}
