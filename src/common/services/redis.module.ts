import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService, MailService],
  exports: [RedisService, MailService],
})
export class RedisModule {}
