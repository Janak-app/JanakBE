import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { AdminProductsService } from './admin-products.service';
import { CreateProductDto } from '../dto/create-product.dto';

@ApiTags('Admin - Products')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('admin/products')
export class AdminProductsController {
  constructor(private adminProductsService: AdminProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all products (admin)' })
  findAll(@Query('search') search?: string, @Query('category') category?: string) {
    return this.adminProductsService.findAll(search, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product detail (admin)' })
  findOne(@Param('id') id: string) {
    return this.adminProductsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add new product' })
  create(@Body() dto: CreateProductDto) {
    return this.adminProductsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit product' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
    return this.adminProductsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  remove(@Param('id') id: string) {
    return this.adminProductsService.remove(id);
  }
}
