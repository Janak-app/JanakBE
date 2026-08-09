import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty({ description: 'Order ID in JP-YYYY-NNNNN format', example: 'JP-2025-00001' })
  @IsString()
  orderId: string;

  @ApiProperty({ description: 'Customer full name', example: 'John Doe' })
  @IsString()
  @Matches(/^[^@]+$/, { message: 'customerName must be a full name, not an email address' })
  customerName: string;

  @ApiProperty({ description: 'Customer email', example: 'john@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ description: 'Customer mobile with country code', example: '919999999999' })
  @IsString()
  @Matches(/^\d{10,12}$/, { message: 'Mobile must be 10-12 digits with country code' })
  customerMobile: string;

  @ApiPropertyOptional({ description: 'Additional param 1', example: '000' })
  @IsOptional()
  @IsString()
  addlParam1?: string;

  @ApiPropertyOptional({ description: 'Additional param 2', example: '000' })
  @IsOptional()
  @IsString()
  addlParam2?: string;
}
