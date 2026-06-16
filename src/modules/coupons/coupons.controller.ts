import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Post('validate')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Validate a coupon code',
    description:
      'Checks if a coupon code is active and not expired. Returns the discount percentage to apply on the subtotal. Case-insensitive.',
  })
  @ApiResponse({
    status: 200,
    description: 'Coupon is valid',
    schema: {
      example: {
        success: true,
        data: {
          code: 'SAVE10',
          discountPercent: '10.00',
        },
        message: 'Success',
        timestamp: '2026-06-16T09:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid or inactive coupon / Coupon has expired' })
  validate(@Body() dto: ValidateCouponDto) {
    return this.couponsService.validate(dto.code);
  }
}
