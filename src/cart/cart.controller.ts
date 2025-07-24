import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCart(@Req() req) {
    // HATA DÜZELTİLDİ: req.user.userId yerine req.user.sub kullanılmalı
    return this.cartService.getCart(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  addItem(@Req() req, @Body() addToCartDto: AddToCartDto) {
    // HATA DÜZELTİLDİ: req.user.userId yerine req.user.sub kullanılmalı
    return this.cartService.addItem(req.user.sub, addToCartDto);
  }
}