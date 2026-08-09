import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { generateQuoteId } from '../../common/utils/order-id.util';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuoteItem } from './entities/quote-item.entity';
import { Quote } from './entities/quote.entity';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Quote)
    private quotesRepository: Repository<Quote>,
    @InjectRepository(QuoteItem)
    private quoteItemRepository: Repository<QuoteItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findAll(userId: string) {
    return this.quotesRepository.find({
      where: { user: { id: userId } },
      relations: { items: { product: { images: true, brand: true } } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const quote = await this.quotesRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { items: { product: { images: true } } },
    });
    if (!quote) throw new NotFoundException('Quote not found');
    return quote;
  }

  async create(user: User, dto: CreateQuoteDto) {
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.productRepository.findBy({ id: In(productIds) });

    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p.id);
      const missing = productIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(`Products not found: ${missing.join(', ')}`);
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    const count = await this.quotesRepository.count();
    const quoteId = generateQuoteId(count + 1);

    const quote = this.quotesRepository.create({
      quoteId,
      user,
      intendedUse: dto.intendedUse,
      budgetRange: dto.budgetRange,
      timeline: dto.timeline,
      notes: dto.notes,
    });
    await this.quotesRepository.save(quote);

    const items = dto.items.map((i) =>
      this.quoteItemRepository.create({
        quote,
        product: productMap.get(i.productId),
        quantity: i.quantity,
      }),
    );
    await this.quoteItemRepository.save(items);

    return this.quotesRepository.findOne({
      where: { id: quote.id },
      relations: { items: { product: { images: true } } },
    });
  }
}
