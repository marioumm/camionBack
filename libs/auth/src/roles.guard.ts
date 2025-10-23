/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// shared/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { OWNER_OR_ADMIN_KEY } from './owner-or-admin.decorator';
import { UserRole } from 'apps/users-service/src/entities/user.entity'; 

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const targetUserId = request.params.id;

    const isOwnerOrAdmin = this.reflector.getAllAndOverride<boolean>(
      OWNER_OR_ADMIN_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (isOwnerOrAdmin) {
      if (user.role === UserRole.ADMIN) {
        return true;
      }
      
      if (user.sub === targetUserId || user.id === targetUserId) {
        return true;
      }
      
      return false;
    }

    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    return requiredRoles.includes(user.role);
  }
}
