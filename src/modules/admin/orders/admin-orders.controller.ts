import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { UserRole } from '../../../common/enums/user-role.enum';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { User } from '../../users/entities/user.entity';
import { AdminOrdersService } from './admin-orders.service';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus) status: OrderStatus;
}

export class UpdateTrackingDto {
  @IsOptional() @IsString() courierName?: string;
  @IsOptional() @IsString() awbNumber?: string;
  @IsOptional() @IsString() trackingUrl?: string;
}

export class AssignShippingDto {
  @IsOptional() @IsString() courierName?: string;
  @IsOptional() @IsString() awbNumber?: string;
  @IsOptional() @IsString() trackingUrl?: string;
}

export class ConfirmNeftDto {
  @IsString() neftReferenceNumber: string;
}

@ApiTags('Admin - Orders')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private adminOrdersService: AdminOrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List all customer orders (admin)' })
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('userId') userId?: string,
  ) {
    return this.adminOrdersService.findAll(status, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order detail (admin)' })
  findOne(@Param('id') id: string) {
    return this.adminOrdersService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.adminOrdersService.updateStatus(id, dto.status);
  }

  @Patch(':id/tracking')
  @ApiOperation({ summary: 'Update courier and AWB tracking' })
  updateTracking(@Param('id') id: string, @Body() dto: UpdateTrackingDto) {
    return this.adminOrdersService.updateTracking(id, dto);
  }

  @Patch(':id/assign-shipping')
  @ApiOperation({ summary: 'Assign order for shipping and request balance payment' })
  assignForShipping(@Param('id') id: string, @Body() dto: AssignShippingDto) {
    return this.adminOrdersService.assignForShipping(id, dto);
  }

  @Patch(':id/confirm-advance-neft')
  @ApiOperation({ summary: 'Confirm NEFT advance payment received' })
  confirmAdvanceNeft(
    @Param('id') id: string,
    @Body() dto: ConfirmNeftDto,
    @CurrentUser() admin: User,
  ) {
    return this.adminOrdersService.confirmNeftAdvance(id, dto.neftReferenceNumber, admin);
  }

  @Patch(':id/confirm-balance-neft')
  @ApiOperation({ summary: 'Confirm NEFT balance payment received' })
  confirmBalanceNeft(
    @Param('id') id: string,
    @Body() dto: ConfirmNeftDto,
    @CurrentUser() admin: User,
  ) {
    return this.adminOrdersService.confirmNeftBalance(id, dto.neftReferenceNumber, admin);
  }
}
