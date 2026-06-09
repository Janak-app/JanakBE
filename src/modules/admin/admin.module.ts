import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from '../brands/entities/brand.entity';
import { Category } from '../categories/entities/category.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { OrderTracking } from '../orders/entities/order-tracking.entity';
import { Order } from '../orders/entities/order.entity';
import { ProductImage } from '../products/entities/product-image.entity';
import { ProductSpec } from '../products/entities/product-spec.entity';
import { Product } from '../products/entities/product.entity';
import { AdminCouponsController } from './coupons/admin-coupons.controller';
import { AdminCouponsService } from './coupons/admin-coupons.service';
import { AdminOrdersController } from './orders/admin-orders.controller';
import { AdminOrdersService } from './orders/admin-orders.service';
import { AdminProductsController } from './products/admin-products.controller';
import { AdminProductsService } from './products/admin-products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, ProductImage, ProductSpec, Category, Brand,
      Order, OrderTracking,
      Coupon,
    ]),
  ],
  controllers: [
    AdminProductsController,
    AdminOrdersController,
    AdminCouponsController,
  ],
  providers: [
    AdminProductsService,
    AdminOrdersService,
    AdminCouponsService,
  ],
})
export class AdminModule {}
