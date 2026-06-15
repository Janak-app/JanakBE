import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminLogsService } from './admin-logs.service';

@ApiTags('Admin - Logs')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('admin/logs')
export class AdminLogsController {
  constructor(private readonly adminLogsService: AdminLogsService) {}

  @Get()
  @ApiOperation({ summary: 'List all API hit logs with optional filters' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'method', required: false, enum: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'] })
  @ApiQuery({ name: 'path', required: false, description: 'Partial path match, e.g. /products' })
  @ApiQuery({ name: 'startDate', required: false, description: 'ISO date string, e.g. 2026-06-01' })
  @ApiQuery({ name: 'endDate', required: false, description: 'ISO date string, e.g. 2026-06-30' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20)' })
  findAll(
    @Query('userId') userId?: string,
    @Query('method') method?: string,
    @Query('path') path?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminLogsService.findAll({ userId, method, path, startDate, endDate, page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full details of a single API log entry' })
  findOne(@Param('id') id: string) {
    return this.adminLogsService.findOne(id);
  }
}
