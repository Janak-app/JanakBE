import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({
    example: 'SAVE10',
    description: 'Coupon code (auto-uppercased). Must be unique.',
  })
  @IsString()
  code: string;

  @ApiProperty({
    example: 10,
    description: 'Discount percentage applied to order subtotal (1–100)',
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  discountPercent: number;

  @ApiPropertyOptional({
    example: '2026-12-31T23:59:59Z',
    description: 'Optional expiry date in ISO 8601 format. Coupon rejects after this date.',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
