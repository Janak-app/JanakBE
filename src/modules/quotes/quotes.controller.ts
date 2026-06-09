import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuotesService } from './quotes.service';

@ApiTags('Quotes')
@ApiBearerAuth()
@Controller('quotes')
export class QuotesController {
  constructor(private quotesService: QuotesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all quotes for current user' })
  findAll(@CurrentUser() user: User) {
    return this.quotesService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quote detail' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.quotesService.findOne(id, user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Submit a quote request' })
  create(@CurrentUser() user: User, @Body() dto: CreateQuoteDto) {
    return this.quotesService.create(user, dto);
  }
}
