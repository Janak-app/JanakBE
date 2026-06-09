import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CheckoutService } from './checkout.service';
import { PlaceOrderDto } from './dto/place-order.dto';

@ApiTags('Checkout')
@ApiBearerAuth()
@Controller('checkout')
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate checkout — validate cart and return summary' })
  initiate(@CurrentUser() user: User) {
    return this.checkoutService.initiate(user);
  }

  @Post('place-order')
  @ApiOperation({ summary: 'Place order with address and payment details' })
  placeOrder(@CurrentUser() user: User, @Body() dto: PlaceOrderDto) {
    return this.checkoutService.placeOrder(user, dto);
  }
}
