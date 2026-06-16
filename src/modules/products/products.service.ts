import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockStatus } from '../../common/enums/stock-status.enum';
import { User } from '../users/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { ProductReview } from './entities/product-review.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductReview)
    private reviewsRepository: Repository<ProductReview>,
  ) {}

  async findAll(filters: ProductFiltersDto) {
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.isActive = :isActive', { isActive: true });

    if (filters.search) {
      query.andWhere(
        '(product.name ILIKE :search OR brand.name ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }
    if (filters.category) {
      query.andWhere('category.slug = :category', { category: filters.category });
    }
    if (filters.brand) {
      query.andWhere('brand.slug = :brand', { brand: filters.brand });
    }
    if (filters.inStock) {
      query.andWhere('product.stockStatus = :status', { status: StockStatus.IN_STOCK });
    }
    if (filters.minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }
    if (filters.featured) {
      query.andWhere('product.isFeatured = true');
    }
    if (filters.newArrival) {
      query.andWhere('product.isNewArrival = true');
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    query.skip((page - 1) * limit).take(limit);

    const [items, total] = await query.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id, isActive: true },
      relations: { category: true, brand: true, images: true, specs: true, documents: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.productsRepository.findOne({
      where: { slug, isActive: true },
      relations: { category: true, brand: true, images: true, specs: true, documents: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findRelated(id: string) {
    const product = await this.findOne(id);
    return this.productsRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.images', 'images')
      .leftJoinAndSelect('p.brand', 'brand')
      .where('p.categoryId = :categoryId', { categoryId: product.category.id })
      .andWhere('p.id != :id', { id })
      .andWhere('p.isActive = true')
      .take(6)
      .getMany();
  }

  async getReviews(productId: string) {
    return this.reviewsRepository.find({
      where: { product: { id: productId } },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async createReview(productId: string, user: User, dto: CreateReviewDto) {
    const product = await this.findOne(productId);
    const review = this.reviewsRepository.create({ ...dto, product, user });
    return this.reviewsRepository.save(review);
  }

  async getDocuments(productId: string) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: { documents: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product.documents;
  }
}
