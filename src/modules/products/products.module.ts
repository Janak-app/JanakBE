import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDocument } from './entities/product-document.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductReview } from './entities/product-review.entity';
import { ProductSpec } from './entities/product-spec.entity';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage,
      ProductSpec,
      ProductDocument,
      ProductReview,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
