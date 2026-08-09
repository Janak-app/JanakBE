import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ApiLog } from './entities/api-log.entity';

export interface ApiLogFilter {
  userId?: string;
  method?: string;
  path?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AdminLogsService {
  constructor(
    @InjectRepository(ApiLog)
    private readonly apiLogRepository: Repository<ApiLog>,
  ) {}

  async findAll(filter: ApiLogFilter) {
    const { userId, method, path, startDate, endDate, page = 1, limit = 20 } = filter;

    const where: FindOptionsWhere<ApiLog> = {};

    if (userId) where.userId = userId;
    if (method) where.method = method.toUpperCase();
    if (path) where.path = ILike(`%${path}%`);
    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    const [items, total] = await this.apiLogRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: string) {
    return this.apiLogRepository.findOne({ where: { id } });
  }
}
