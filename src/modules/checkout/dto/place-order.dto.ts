import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentMethod } from '../../../common/enums/payment-method.enum';

export class NeftDetailsDto {
  @ApiProperty() accountName: string;
  @ApiProperty() accountNumber: string;
  @ApiProperty() ifscCode: string;
  @ApiProperty() bankName: string;
  @ApiProperty() qrCodeUrl: string;
}

export class PlaceOrderResponseDto {
  @ApiProperty({ example: 'JP-2026-00013' }) orderId: string;
  @ApiProperty() id: string;
  @ApiProperty({ example: 100000 }) totalAmount: number;
  @ApiProperty({ example: 40000, description: 'Amount to pay now via UPI/gateway' }) advanceAmount: number;
  @ApiProperty({ example: 60000, description: 'Amount to pay later via NEFT' }) balanceAmount: number;
  @ApiProperty({ description: 'True if full payment collected upfront (order <= ₹40,000)' }) isFullPayment: boolean;
  @ApiPropertyOptional({ type: NeftDetailsDto, description: 'Present only when isFullPayment is false' }) neftDetails?: NeftDetailsDto;
  @ApiProperty() estimatedDeliveryStart: Date;
  @ApiProperty() estimatedDeliveryEnd: Date;
  @ApiProperty() message: string;
}

export class PlaceOrderDto {
  @ApiProperty()
  @IsUUID()
  addressId: string;

  @ApiPropertyOptional({ enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requiresGstBill?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  couponCode?: string;
}
