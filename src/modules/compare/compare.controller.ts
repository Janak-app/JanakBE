import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CompareService } from './compare.service';

@ApiTags('Compare')
@Controller('compare')
export class CompareController {
  constructor(private compareService: CompareService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Compare up to 4 products side by side' })
  @ApiQuery({ name: 'ids', description: 'Comma-separated product IDs (max 4)' })
  compare(@Query('ids') ids: string) {
    const productIds = ids.split(',').slice(0, 4);
    return this.compareService.compare(productIds);
  }
}
