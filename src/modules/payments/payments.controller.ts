import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { User } from '../users/entities/user.entity';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initiate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate ICICI payment for an order' })
  initiatePayment(
    @CurrentUser() user: User,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiatePayment(user, dto);
  }

  @Post('callback')
  @Public()
  @UsePipes(new ValidationPipe({ whitelist: false }))
  @ApiOperation({ summary: 'ICICI payment callback — called by gateway after payment' })
  handleCallback(@Body() payload: Record<string, any>) {
    return this.paymentsService.handleCallback(payload);
  }

  @Get('status/:merchantTxnNo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check payment status from ICICI gateway' })
  checkStatus(
    @Param('merchantTxnNo') merchantTxnNo: string,
    @CurrentUser() user: User,
  ) {
    return this.paymentsService.checkStatus(merchantTxnNo, user);
  }

  @Get('my-transactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payment transactions for current user' })
  getMyTransactions(@CurrentUser() user: User) {
    return this.paymentsService.getMyTransactions(user);
  }
}
