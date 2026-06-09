import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  findAll(userId: string, status?: OrderStatus) {
    const where: any = { user: { id: userId } };
    if (status) where.status = status;
    return this.ordersRepository.find({
      where,
      relations: { items: { product: { images: true } }, tracking: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { items: { product: { images: true } }, tracking: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
