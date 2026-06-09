import { Injectable, NotFoundException } from '@nestjs/common';
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

  create(dto: CreateCouponDto) {
    const coupon = this.couponsRepository.create({
      ...dto,
      code: dto.code.toUpperCase(),
    });
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
