import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { WishlistItem } from './entities/wishlist-item.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private wishlistRepository: Repository<WishlistItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findAll(userId: string) {
    return this.wishlistRepository.find({
      where: { user: { id: userId } },
      relations: { product: { images: true, brand: true } },
      order: { savedAt: 'DESC' },
    });
  }

  async addItem(user: User, productId: string) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    const existing = await this.wishlistRepository.findOne({
      where: { user: { id: user.id }, product: { id: productId } },
    });
    if (existing) return existing;
    const item = this.wishlistRepository.create({ user, product });
    return this.wishlistRepository.save(item);
  }

  async removeItem(userId: string, productId: string) {
    const item = await this.wishlistRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (!item) throw new NotFoundException('Wishlist item not found');
    await this.wishlistRepository.remove(item);
    return { message: 'Removed from wishlist' };
  }
}
