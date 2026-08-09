import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { CreateCouponDto } from '../dto/create-coupon.dto';

@Injectable()
export class AdminCouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponsRepository: Repository<Coupon>,
  ) {}

  findAll() {
    return this.couponsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateCouponDto) {
    const code = dto.code.toUpperCase();
    const existing = await this.couponsRepository.findOne({ where: { code } });
    if (existing) throw new ConflictException('Coupon code already exists');
    const coupon = this.couponsRepository.create({ ...dto, code });
    return this.couponsRepository.save(coupon);
  }

  async update(id: string, dto: Partial<CreateCouponDto>) {
    const coupon = await this.couponsRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (dto.code) dto.code = dto.code.toUpperCase();
    Object.assign(coupon, dto);
    return this.couponsRepository.save(coupon);
  }

  async remove(id: string) {
    const coupon = await this.couponsRepository.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    await this.couponsRepository.remove(coupon);
    return { message: 'Coupon deleted' };
  }
}
