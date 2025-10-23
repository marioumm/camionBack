import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export const GuestOrUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): { userId?: string; guestId?: string } => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (user?.sub || user?.id) {
      return { userId: user.sub || user.id };
    }

    let guestId = request.headers['x-guest-id'] || request.query.guestId;
    
    if (!guestId) {
      guestId = `guest_${uuidv4()}`;
    }

    return { guestId };
  },
);
