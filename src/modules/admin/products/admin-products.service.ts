import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Brand } from '../../brands/entities/brand.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductImage } from '../../products/entities/product-image.entity';
import { ProductSpec } from '../../products/entities/product-spec.entity';
import { Product } from '../../products/entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class AdminProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
    @InjectRepository(ProductImage)
    private imagesRepository: Repository<ProductImage>,
    @InjectRepository(ProductSpec)
    private specsRepository: Repository<ProductSpec>,
  ) {}

  findAll(search?: string, category?: string) {
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.images', 'images');

    if (search) {
      query.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }
    if (category) {
      query.andWhere('category.slug = :category', { category });
    }
    return query.orderBy('product.createdAt', 'DESC').getMany();
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { category: true, brand: true, images: true, specs: true, documents: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto) {
    const category = await this.categoriesRepository.findOne({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException('Category not found');

    const brand = await this.brandsRepository.findOne({ where: { id: dto.brandId } });
    if (!brand) throw new NotFoundException('Brand not found');

    const slug = slugify(dto.name, { lower: true, strict: true });
    const product = this.productsRepository.create({ ...dto, slug, category, brand });
    const saved = await this.productsRepository.save(product);

    if (dto.images?.length) {
      const images = dto.images.map((img) =>
        this.imagesRepository.create({ ...img, product: saved }),
      );
      await this.imagesRepository.save(images);
    }
    if (dto.specs?.length) {
      const specs = dto.specs.map((spec) =>
        this.specsRepository.create({ ...spec, product: saved }),
      );
      await this.specsRepository.save(specs);
    }
    return this.findOne(saved.id);
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    await this.productsRepository.save(product);
    return this.findOne(id);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    return { message: 'Product deleted' };
  }
}
