import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

export interface TrackingEvent {
  status: string;
  timestamp: Date;
  message: string;
}

@Entity('order_tracking')
export class OrderTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  courierName: string;

  @Column({ nullable: true })
  awbNumber: string;

  @Column({ nullable: true })
  trackingUrl: string;

  @Column({ type: 'jsonb', default: [] })
  events: TrackingEvent[];

  @OneToOne(() => Order, (order) => order.tracking, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Order;

  @UpdateDateColumn()
  updatedAt: Date;
}
