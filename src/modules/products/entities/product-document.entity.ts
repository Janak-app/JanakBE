import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_documents')
export class ProductDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  fileType: string;

  @ManyToOne(() => Product, (product) => product.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;
}
