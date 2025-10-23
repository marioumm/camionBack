import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService, SendPushDto } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @MessagePattern({ cmd: 'send_push_notification' })
  async handleSend(@Payload() payload: SendPushDto) {
    return this.notificationService.sendToToken(payload);
  }

  @MessagePattern({ cmd: 'get_user_notifications' })
  async handleGetUserNotifications(@Payload() data: { userId: string }) {
    return this.notificationService.getUserNotifications(data.userId);
  }
}
