import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { OrderTracking } from '../../orders/entities/order-tracking.entity';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationType } from '../../notifications/entities/notification.entity';

@Injectable()
export class AdminOrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderTracking)
    private trackingRepository: Repository<OrderTracking>,
    private notificationsService: NotificationsService,
    private configService: ConfigService,
  ) {}

  findAll(status?: OrderStatus, userId?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (userId) where.user = { id: userId };
    return this.ordersRepository.find({
      where,
      relations: { user: true, items: { product: true }, tracking: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: { user: true, items: { product: true }, tracking: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.findOne(id);
    order.status = status;
    await this.ordersRepository.save(order);

    if (order.tracking) {
      order.tracking.events.push({
        status,
        timestamp: new Date(),
        message: `Order status updated to ${status}`,
      });
      await this.trackingRepository.save(order.tracking);
    }
    return this.findOne(id);
  }

  async updateTracking(id: string, data: { courierName?: string; awbNumber?: string; trackingUrl?: string }) {
    const order = await this.findOne(id);
    if (!order.tracking) throw new NotFoundException('Tracking record not found');
    Object.assign(order.tracking, data);
    await this.trackingRepository.save(order.tracking);
    return this.findOne(id);
  }

  async confirmNeftAdvance(orderId: string, neftRef: string, adminUser: User) {
    const order = await this.findOne(orderId);
    order.advancePaid = true;
    order.neftReferenceNumber = neftRef;
    order.status = OrderStatus.ADVANCE_PAID;
    await this.ordersRepository.save(order);

    if (order.user) {
      await this.notificationsService.create(order.user, {
        title: 'Advance Payment Confirmed',
        message: `Your NEFT advance payment of ₹${Number(order.advanceAmount).toFixed(2)} for order ${order.orderId} has been confirmed. UTR: ${neftRef}`,
        type: NotificationType.PAYMENT_CONFIRMED,
        orderId: order.orderId,
        metadata: { amount: order.advanceAmount, neftReferenceNumber: neftRef },
      });
    }

    return this.findOne(orderId);
  }

  async confirmNeftBalance(orderId: string, neftRef: string, adminUser: User) {
    const order = await this.findOne(orderId);
    order.balancePaid = true;
    order.balanceNeftReferenceNumber = neftRef;
    order.status = OrderStatus.BALANCE_PAID;
    await this.ordersRepository.save(order);

    if (order.user) {
      await this.notificationsService.create(order.user, {
        title: 'Balance Payment Confirmed',
        message: `Your balance payment of ₹${Number(order.balanceAmount).toFixed(2)} for order ${order.orderId} has been confirmed. UTR: ${neftRef}. Your order will be shipped soon.`,
        type: NotificationType.PAYMENT_CONFIRMED,
        orderId: order.orderId,
        metadata: { amount: order.balanceAmount, balanceNeftReferenceNumber: neftRef },
      });
    }

    return this.findOne(orderId);
  }

  async assignForShipping(id: string, dto: { courierName?: string; awbNumber?: string; trackingUrl?: string }) {
    const order = await this.findOne(id);
    order.status = OrderStatus.ASSIGNED_FOR_SHIPPING;
    await this.ordersRepository.save(order);

    if (order.tracking) {
      if (dto.courierName) order.tracking.courierName = dto.courierName;
      if (dto.awbNumber) order.tracking.awbNumber = dto.awbNumber;
      if (dto.trackingUrl) order.tracking.trackingUrl = dto.trackingUrl;
      order.tracking.events.push({
        status: OrderStatus.ASSIGNED_FOR_SHIPPING,
        timestamp: new Date(),
        message: 'Order assigned for shipping. Please complete balance payment.',
      });
      await this.trackingRepository.save(order.tracking);
    }

    const neftDetails = {
      accountName: this.configService.get<string>('NEFT_ACCOUNT_NAME'),
      accountNumber: this.configService.get<string>('NEFT_ACCOUNT_NUMBER'),
      ifscCode: this.configService.get<string>('NEFT_IFSC_CODE'),
      bankName: this.configService.get<string>('NEFT_BANK_NAME'),
      qrCodeUrl: this.configService.get<string>('QR_CODE_URL'),
    };

    if (order.user) {
      await this.notificationsService.create(order.user, {
        title: 'Balance Payment Required',
        message: `Your order ${order.orderId} is ready for shipping. Please pay the remaining 90% (₹${Number(order.balanceAmount).toFixed(2)}) via NEFT or QR code. Account: ${neftDetails.accountNumber}, IFSC: ${neftDetails.ifscCode}`,
        type: NotificationType.PAYMENT_BALANCE,
        orderId: order.orderId,
        metadata: {
          balanceAmount: order.balanceAmount,
          neftDetails,
        },
      });
    }

    return this.findOne(id);
  }
}
