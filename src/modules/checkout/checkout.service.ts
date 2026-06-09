import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { calculateGst } from '../../common/utils/gst.util';
import { generateOrderId } from '../../common/utils/order-id.util';
import { Address } from '../addresses/entities/address.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { OrderTracking } from '../orders/entities/order-tracking.entity';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Cart } from '../cart/entities/cart.entity';
import { PlaceOrderDto } from './dto/place-order.dto';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    private dataSource: DataSource,
  ) {}

  async initiate(user: User) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: { items: { product: true } },
    });
    if (!cart || !cart.items.length) throw new BadRequestException('Cart is empty');

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
    const { gstAmount, totalAmount } = calculateGst(subtotal);
    const shippingAmount = subtotal >= 50000 ? 0 : 500;

    return {
      items: cart.items,
      summary: { subtotal, gstAmount, shippingAmount, totalAmount: totalAmount + shippingAmount },
    };
  }

  async placeOrder(user: User, dto: PlaceOrderDto) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: { items: { product: true } },
    });
    if (!cart || !cart.items.length) throw new BadRequestException('Cart is empty');

    const address = await this.addressRepository.findOne({
      where: { id: dto.addressId, user: { id: user.id } },
    });
    if (!address) throw new NotFoundException('Address not found');

    let coupon: Coupon | null = null;
    if (dto.couponCode) {
      coupon = await this.couponRepository.findOne({
        where: { code: dto.couponCode.toUpperCase(), isActive: true },
      });
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
    const { gstAmount } = calculateGst(subtotal);
    const discountAmount = coupon
      ? Math.round(subtotal * (Number(coupon.discountPercent) / 100))
      : 0;
    const shippingAmount = subtotal >= 50000 ? 0 : 500;
    const totalAmount = subtotal + gstAmount - discountAmount + shippingAmount;

    const estimatedStart = new Date();
    estimatedStart.setDate(estimatedStart.getDate() + 5);
    const estimatedEnd = new Date();
    estimatedEnd.setDate(estimatedEnd.getDate() + 8);

    return this.dataSource.transaction(async (manager) => {
      const count = await manager.count(Order);
      const orderId = generateOrderId(count + 1);

      const order = manager.create(Order, {
        orderId,
        user,
        subtotal,
        gstAmount,
        shippingAmount,
        totalAmount,
        paymentMethod: dto.paymentMethod,
        transactionId: dto.transactionId,
        estimatedDeliveryStart: estimatedStart,
        estimatedDeliveryEnd: estimatedEnd,
        shippingAddress: {
          fullName: address.fullName,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2 ?? '',
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          phone: address.phone,
        },
      });
      await manager.save(order);

      const orderItems = cart.items.map((item) =>
        manager.create(OrderItem, {
          order,
          product: item.product,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: Number(item.product.price) * item.quantity,
        }),
      );
      await manager.save(orderItems);

      const tracking = manager.create(OrderTracking, {
        order,
        events: [{ status: 'Order Placed', timestamp: new Date(), message: 'Your order has been placed successfully' }],
      });
      await manager.save(tracking);

      await manager.delete('cart_items', { cart: { id: cart.id } });

      return {
        orderId: order.orderId,
        id: order.id,
        totalAmount: order.totalAmount,
        estimatedDeliveryStart: estimatedStart,
        estimatedDeliveryEnd: estimatedEnd,
        paymentMethod: order.paymentMethod,
        message: 'Order placed successfully',
      };
    });
  }
}
