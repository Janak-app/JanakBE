import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStage, PaymentStatus } from '../../../common/enums/payment-method.enum';
import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';

@Entity('payment_transactions')
export class PaymentTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  merchantTxnNo: string;

  @Column({ nullable: true })
  tranCtx: string;

  @Column({ nullable: true })
  iciciTxnId: string;

  @Column({ nullable: true })
  iciciAuthId: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  paymentMode: string;

  @Column({ nullable: true })
  responseCode: string;

  @Column({ nullable: true })
  txnResponseCode: string;

  @Column({ type: 'jsonb', nullable: true })
  iciciRequest: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  iciciResponse: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  callbackPayload: Record<string, any>;

  @Column({ type: 'enum', enum: PaymentStage, nullable: true })
  paymentStage: PaymentStage;

  @ManyToOne(() => Order)
  @JoinColumn()
  order: Order;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
