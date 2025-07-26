import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Metot veya controller üzerinde tanımlanmış 'roles' metadata'sını al
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Rol gereksinimi yoksa erişime izin ver
    }

    // İstek atan kullanıcının rol bilgisini al
    // JWT Strategy'de payload'dan role'ü çekip req.user'a eklemiştik.
    const { user } = context.switchToHttp().getRequest();

    // Kullanıcının rolünün, gerekli rollerden en az birine sahip olup olmadığını kontrol et
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
