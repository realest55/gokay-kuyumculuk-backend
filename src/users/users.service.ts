import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // AuthService'in kullanıcıyı e-posta adresine göre bulması için
  async findByEmail(email: string): Promise<User | null> { // <-- HATA DÜZELTİLDİ: undefined yerine null
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  // Yeni kullanıcı oluşturmak için
  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
}
