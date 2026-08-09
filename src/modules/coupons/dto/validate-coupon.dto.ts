import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ValidateCouponDto {
  @ApiProperty({
    example: 'SAVE10',
    description: 'Coupon code to validate. Case-insensitive.',
  })
  @IsString()
  code: string;
}
