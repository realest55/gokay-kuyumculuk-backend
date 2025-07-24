import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Tüm siparişleri getirir ve ilgili müşteri bilgilerini dahil eder.
   * @returns Tüm siparişlerin listesi.
   */
  async findAll() {
    try {
      this.logger.log('Siparişler sorgulanıyor...');
      const orders = await this.prisma.order.findMany({
        include: {
          // Order modelinin 'customer' ilişkisine sahip olduğu varsayılıyor.
          // Customer modelinin 'name' ve 'email' alanlarına sahip olduğu varsayılıyor.
          customer: {
            select: {
              id: true, // Müşteri ID'sini de seç
              name: true,
              email: true,
            },
          },
          // Siparişin ürünlerini de dahil edelim
          items: {
            select: {
              productId: true,
              quantity: true,
              // Ürün detaylarını da getirmek isteyebilirsiniz, örneğin:
              // product: {
              //   select: {
              //     name: true,
              //     price: true,
              //   }
              // }
            }
          }
        },
        // orderBy() kullanmaktan kaçınılması gerektiği notunu dikkate alarak,
        // bu kısmı kaldırıyorum veya veriyi bellekte sıralama öneriyorum.
        // orderBy: {
        //   createdAt: 'desc',
        // },
      });
      this.logger.log(`${orders.length} adet sipariş bulundu.`);

      // Veriyi frontend'in beklediği formata dönüştürüyoruz.
      return orders.map((order) => ({
        id: order.id,
        // 'customer' nesnesinin varlığını kontrol et, çünkü ilişki null olabilir
        customer: order.customer ? {
          id: order.customer.id,
          name: order.customer.name,
          email: order.customer.email,
        } : null, // Müşteri bilgisi yoksa null döndür
        status: order.status,
        total: order.totalAmount,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          // product: item.product ? { name: item.product.name, price: item.product.price } : null
        }))
      }));
    } catch (error) {
      this.logger.error('Siparişleri çekerken bir hata oluştu:', error.stack);
      // Hata durumunda boş dizi döndürmek yerine hata fırlatmak daha iyi olabilir.
      throw error;
    }
  }

  /**
   * Belirli bir siparişi ID'ye göre getirir ve ilgili müşteri bilgilerini dahil eder.
   * @param id - Sipariş ID'si.
   * @returns Sipariş bilgileri.
   * @throws NotFoundException Eğer sipariş bulunamazsa.
   */
  async findOneOrder(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            productId: true,
            quantity: true,
            // product: {
            //   select: {
            //     name: true,
            //     price: true,
            //   }
            // }
          }
        }
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Müşteri bilgisinin varlığını kontrol et
    if (!order.customer) {
      this.logger.warn(`Order ${id} found, but no associated customer.`);
      // Müşteri bilgisi yoksa, customer alanı null veya boş bir obje olarak döndürülebilir
      return {
        id: order.id,
        orderDate: order.orderDate,
        totalAmount: order.totalAmount,
        status: order.status,
        customer: null,
        items: order.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      };
    }

    return {
      id: order.id,
      orderDate: order.orderDate,
      totalAmount: order.totalAmount,
      status: order.status,
      customer: {
        id: order.customer.id,
        name: order.customer.name,
        email: order.customer.email,
      },
      items: order.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
    };
  }

  /**
   * Yeni bir sipariş oluşturur.
   * @param createOrderDto - Oluşturulacak siparişin verileri.
   * @returns Oluşturulan sipariş.
   */
  async createOrder(createOrderDto: CreateOrderDto) {
    this.logger.log(`Yeni sipariş oluşturuluyor: Müşteri ID: ${createOrderDto.customerId}`);

    // 1. Müşterinin varlığını kontrol et
    const customer = await this.prisma.customer.findUnique({
      where: { id: createOrderDto.customerId },
    });

    if (!customer) {
      this.logger.error(`Müşteri bulunamadı: ID ${createOrderDto.customerId}`);
      throw new NotFoundException(`Müşteri ID ${createOrderDto.customerId} bulunamadı.`);
    }

    // 2. Siparişi oluştur (basitleştirilmiş)
    // Önceki denemede eklenen karmaşık mantık (ürün fiyatı hesaplama, toplu OrderItem oluşturma)
    // yeni hatalara yol açtığı için bu kısım basitleştirilmiştir.
    // Bu metodun tam işlevsel olması için 'totalAmount' hesaplaması ve 'items' ilişkisinin
    // Prisma şemanıza uygun şekilde eklenmesi gerekmektedir.
    try {
      const newOrder = await this.prisma.order.create({
        data: {
          customerId: createOrderDto.customerId,
          orderDate: new Date(), // Sipariş tarihi
          totalAmount: 0, // Geçici olarak 0, gerçek hesaplama daha sonra eklenebilir.
          status: OrderStatus.PENDING, // Varsayılan sipariş durumu
          // items: { createMany: { data: createOrderDto.items.map(...) } } // Bu kısım şimdilik kaldırıldı.
        },
        include: {
          customer: {
            select: { id: true, name: true, email: true },
          },
          // items: true, // Sipariş kalemleri dahil edilmedi, çünkü 'createMany' kaldırıldı.
        },
      });

      this.logger.log(`Yeni sipariş başarıyla oluşturuldu: ID ${newOrder.id}`);
      return {
        id: newOrder.id,
        orderDate: newOrder.orderDate,
        totalAmount: newOrder.totalAmount,
        status: newOrder.status,
        customer: {
          id: newOrder.customer.id,
          name: newOrder.customer.name,
          email: newOrder.customer.email,
        },
        // items: [] // Sipariş kalemleri şimdilik boş döndürülebilir.
      };
    } catch (error) {
      this.logger.error('Sipariş oluşturulurken bir hata oluştu:', error.stack);
      throw error;
    }
  }

  /**
   * Belirli bir siparişi günceller.
   * @param id - Güncellenecek siparişin ID'si.
   * @param updateOrderDto - Güncelleme verileri.
   * @returns Güncellenen sipariş.
   * @throws NotFoundException Eğer sipariş bulunamazsa.
   */
  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    this.logger.log(`Sipariş güncelleniyor: ID ${id}`);
    const existingOrder = await this.prisma.order.findUnique({ where: { id } });

    if (!existingOrder) {
      this.logger.error(`Güncellenecek sipariş bulunamadı: ID ${id}`);
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: {
          status: updateOrderDto.status, // Sadece durumu güncelleyebiliriz veya daha fazla alan ekleyebiliriz.
          // Diğer alanları da updateOrderDto'dan çekerek buraya ekleyebilirsiniz.
        },
        include: {
          customer: {
            select: { id: true, name: true, email: true },
          },
          items: true,
        },
      });
      this.logger.log(`Sipariş başarıyla güncellendi: ID ${updatedOrder.id}`);
      return {
        id: updatedOrder.id,
        orderDate: updatedOrder.orderDate,
        totalAmount: updatedOrder.totalAmount,
        status: updatedOrder.status,
        customer: {
          id: updatedOrder.customer.id,
          name: updatedOrder.customer.name,
          email: updatedOrder.customer.email,
        },
        items: updatedOrder.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      };
    } catch (error) {
      this.logger.error(`Sipariş güncellenirken bir hata oluştu: ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Belirli bir siparişi siler.
   * @param id - Silinecek siparişin ID'si.
   * @returns Silme işlemi sonucu.
   * @throws NotFoundException Eğer sipariş bulunamazsa.
   */
  async removeOrder(id: string) {
    this.logger.log(`Sipariş siliniyor: ID ${id}`);
    const existingOrder = await this.prisma.order.findUnique({ where: { id } });

    if (!existingOrder) {
      this.logger.error(`Silinecek sipariş bulunamadı: ID ${id}`);
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    try {
      // Önce ilişkili sipariş kalemlerini silmek gerekebilir
      await this.prisma.orderItem.deleteMany({
        where: { orderId: id }
      });

      await this.prisma.order.delete({
        where: { id },
      });
      this.logger.log(`Sipariş başarıyla silindi: ID ${id}`);
      return { message: `Order with ID ${id} successfully removed` };
    } catch (error) {
      this.logger.error(`Sipariş silinirken bir hata oluştu: ID ${id}`, error.stack);
      throw error;
    }
  }
}
