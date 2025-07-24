import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Modülü global yaparak her yerden erişilebilir hale getiriyoruz
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Diğer modüllerin kullanabilmesi için export ediyoruz
})
export class PrismaModule {}
