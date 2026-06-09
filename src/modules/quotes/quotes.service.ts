import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateQuoteId } from '../../common/utils/order-id.util';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { Quote } from './entities/quote.entity';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private quotesRepository: Repository<Quote>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findAll(userId: string) {
    return this.quotesRepository.find({
      where: { user: { id: userId } },
      relations: { product: { images: true, brand: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const quote = await this.quotesRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { product: { images: true } },
    });
    if (!quote) throw new NotFoundException('Quote not found');
    return quote;
  }

  async create(user: User, dto: CreateQuoteDto) {
    const product = await this.productRepository.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    const count = await this.quotesRepository.count();
    const quoteId = generateQuoteId(count + 1);

    const quote = this.quotesRepository.create({
      ...dto,
      quoteId,
      user,
      product,
    });
    return this.quotesRepository.save(quote);
  }
}
