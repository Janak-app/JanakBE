import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: 'SAVE10' })
  @IsString()
  code: string;

  @ApiProperty({ example: 10, description: 'Discount percentage (1-100)' })
  @IsNumber()
  @Min(1)
  @Max(100)
  discountPercent: number;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
