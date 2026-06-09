import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { OrderTracking } from '../../orders/entities/order-tracking.entity';
import { Order } from '../../orders/entities/order.entity';

@Injectable()
export class AdminOrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderTracking)
    private trackingRepository: Repository<OrderTracking>,
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
}
