/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { FIREBASE_ADMIN } from '../firebase/firebase.provider';
import * as admin from 'firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';


export type SendPushDto = {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  userId?: string;
};


@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(FIREBASE_ADMIN) private readonly firebase: typeof admin,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) { }


  async sendToToken(dto: SendPushDto & { userId?: string }) {
    const message: admin.messaging.Message = {
      token: dto.token,
      notification: { title: dto.title, body: dto.body },
      data: dto.data || {},
    };

    try {
      const res = await this.firebase.messaging().send(message);

      if (dto.userId) {
        await this.notificationRepo.save({
          userId: dto.userId,
          title: dto.title,
          body: dto.body,
          data: dto.data,
          isRead: false,
        });
      }

      this.logger.log(`Sent push to ${dto.token.slice(0, 10)}... ✅ (${res})`);
      return { id: res };
    } catch (err: any) {
      this.logger.error(`FCM error: ${err?.message || err}`);
      throw err;
    }
  }



  async getUserNotifications(userId: string) {
    return await this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
