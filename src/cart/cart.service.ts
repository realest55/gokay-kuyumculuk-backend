import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Cart, CartDocument } from './schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async getCart(userId: string): Promise<CartDocument> {
    const userObjectId = new Types.ObjectId(userId);
    let cart = await this.cartModel.findOne({ userId: userObjectId }).populate('items.productId').exec();

    if (!cart) {
      cart = new this.cartModel({ userId: userObjectId, items: [] });
      await cart.save();
    }
    return cart;
  }

  async addItem(userId: string, addToCartDto: AddToCartDto): Promise<CartDocument> {
    const { productId, quantity } = addToCartDto;
    const cart = await this.getCart(userId);

    const productObjectId = new Types.ObjectId(productId);
    const itemIndex = cart.items.findIndex((item) => item.productId.equals(productObjectId));

    if (itemIndex > -1) {
      // Ürün sepette varsa, miktarını artır
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Ürün sepette yoksa, yeni bir ürün olarak ekle
      cart.items.push({ productId: productObjectId, quantity });
    }

    return cart.save();
  }
}
