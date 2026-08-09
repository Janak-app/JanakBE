import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  create(user: User, data: {
    title: string;
    message: string;
    type: NotificationType;
    orderId?: string;
    metadata?: Record<string, any>;
  }) {
    const notification = this.notificationRepository.create({ user, ...data });
    return this.notificationRepository.save(notification);
  }

  findAll(userId: string) {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markRead(id: string, userId: string) {
    await this.notificationRepository.update(
      { id, user: { id: userId } },
      { isRead: true },
    );
    return { success: true };
  }

  async markAllRead(userId: string) {
    await this.notificationRepository.update(
      { user: { id: userId }, isRead: false },
      { isRead: true },
    );
    return { success: true };
  }

  countUnread(userId: string) {
    return this.notificationRepository.count({
      where: { user: { id: userId }, isRead: false },
    });
  }
}
