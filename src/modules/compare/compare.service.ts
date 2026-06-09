import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CompareService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  compare(productIds: string[]) {
    return this.productRepository.find({
      where: { id: In(productIds) },
      relations: { images: true, specs: true, brand: true, category: true },
    });
  }
}
