import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuoteStatus } from '../../../common/enums/quote-status.enum';
import { User } from '../../users/entities/user.entity';
import { QuoteItem } from './quote-item.entity';

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  quoteId: string; // Q-YYYY-NNNNN

  @Column({ type: 'enum', enum: QuoteStatus, default: QuoteStatus.PENDING })
  status: QuoteStatus;

  @Column({ type: 'text', nullable: true })
  intendedUse: string;

  @Column({ nullable: true })
  budgetRange: string;

  @Column({ nullable: true })
  timeline: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  quotedPrice: number;

  @Column({ nullable: true })
  validUntil: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToMany(() => QuoteItem, (item) => item.quote, { cascade: true })
  items: QuoteItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
