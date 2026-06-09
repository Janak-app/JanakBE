import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { CouponUsageType } from '../../coupons/entities/coupon.entity';

export class CreateCouponDto {
  @ApiProperty({ example: 'SAVE10' })
  @IsString()
  code: string;

  @ApiProperty({ example: 10, description: 'Discount percentage' })
  @IsNumber()
  @Min(1)
  @Max(100)
  discountPercent: number;

  @ApiProperty({ enum: CouponUsageType })
  @IsEnum(CouponUsageType)
  usageType: CouponUsageType;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
