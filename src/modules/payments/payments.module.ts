import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentTransaction } from './entities/payment-transaction.entity';
import { IciciPaymentService } from './icici-payment.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentTransaction, Order]),
    NotificationsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, IciciPaymentService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
