import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiLog } from '../../api-logs/entities/api-log.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

export interface UsersFilter {
  search?: string;
  hasCartItems?: boolean;
  abandoned?: boolean;
  idleHours?: number;
  page?: number;
  limit?: number;
}

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ApiLog)
    private apiLogRepository: Repository<ApiLog>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAll(filter: UsersFilter) {
    const { search, hasCartItems, abandoned, idleHours = 24, page = 1, limit = 20 } = filter;

    const usersQuery = this.userRepository.createQueryBuilder('user');

    if (search) {
      usersQuery.where('user.email ILIKE :search', { search: `%${search}%` });
    }

    const [users, total] = await usersQuery
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - idleHours);

    const enriched = await Promise.all(
      users.map(async (user) => {
        const [cart, lastLogin, orderCount] = await Promise.all([
          this.cartRepository.findOne({
            where: { user: { id: user.id } },
            relations: { items: { product: true } },
          }),
          this.apiLogRepository.findOne({
            where: { userId: user.id, path: '/api/v1/auth/login', method: 'POST', statusCode: 200 },
            order: { createdAt: 'DESC' },
          }),
          this.orderRepository.count({ where: { user: { id: user.id } } }),
        ]);

        const cartItemCount = cart?.items?.length ?? 0;
        const isAbandoned =
          cartItemCount > 0 &&
          !!cart &&
          cart.updatedAt < cutoff &&
          orderCount === 0;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          joinedAt: user.createdAt,
          lastLoginAt: lastLogin?.createdAt ?? null,
          lastLoginIp: lastLogin?.ip ?? null,
          orderCount,
          cart: {
            itemCount: cartItemCount,
            lastUpdated: cart?.updatedAt ?? null,
            isAbandoned,
            idleSinceHours: cart
              ? Math.floor((Date.now() - new Date(cart.updatedAt).getTime()) / (1000 * 60 * 60))
              : null,
          },
        };
      }),
    );

    let items = enriched;

    if (hasCartItems) {
      items = items.filter((u) => u.cart.itemCount > 0);
    }

    if (abandoned) {
      items = items.filter((u) => u.cart.isAbandoned);
    }

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string) {
    const [user, cart, orders, loginHistory, recentActivity] = await Promise.all([
      this.userRepository.findOne({ where: { id: userId } }),
      this.cartRepository.findOne({
        where: { user: { id: userId } },
        relations: { items: { product: { images: true } }, savedItems: { product: true } },
      }),
      this.orderRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
        take: 10,
      }),
      this.apiLogRepository.find({
        where: { userId, path: '/api/v1/auth/login', method: 'POST', statusCode: 200 },
        order: { createdAt: 'DESC' },
        take: 10,
        select: { createdAt: true, ip: true, userAgent: true, durationMs: true },
      }),
      this.apiLogRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: 20,
        select: { id: true, method: true, path: true, statusCode: true, ip: true, durationMs: true, createdAt: true },
      }),
    ]);

    return {
      user,
      cart,
      orders,
      loginHistory,
      recentActivity,
    };
  }
}
