import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiLoggerInterceptor } from '../../common/interceptors/api-logger.interceptor';
import { AdminLogsController } from './admin-logs.controller';
import { AdminLogsService } from './admin-logs.service';
import { ApiLog } from './entities/api-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiLog])],
  controllers: [AdminLogsController],
  providers: [
    AdminLogsService,
    ApiLoggerInterceptor,
    { provide: APP_INTERCEPTOR, useClass: ApiLoggerInterceptor },
  ],
})
export class ApiLogsModule {}
