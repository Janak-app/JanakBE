import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { AdminCouponsService } from './admin-coupons.service';

@ApiTags('Admin - Coupons')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('admin/coupons')
export class AdminCouponsController {
  constructor(private adminCouponsService: AdminCouponsService) {}

  @Get()
  @ApiOperation({ summary: 'List all coupon codes' })
  findAll() {
    return this.adminCouponsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new coupon code' })
  create(@Body() dto: CreateCouponDto) {
    return this.adminCouponsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit coupon' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateCouponDto>) {
    return this.adminCouponsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete coupon' })
  remove(@Param('id') id: string) {
    return this.adminCouponsService.remove(id);
  }
}
