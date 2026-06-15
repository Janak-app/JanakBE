import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RedisService } from '../../../common/services/redis.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp?: number;
}

const extractFromCookieOrHeader = (req: Request): string | null => {
  if (req.cookies?.accessToken) return req.cookies.accessToken;
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private redisService: RedisService,
  ) {
    super({
      jwtFromRequest: extractFromCookieOrHeader,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') ?? 'secret',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const token = extractFromCookieOrHeader(req);
    if (token) {
      const blacklisted = await this.redisService.get(`blacklist:${token}`);
      if (blacklisted) throw new UnauthorizedException('Token has been revoked');
    }
    if (payload.role === 'guest') return payload;
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user || !user.isActive) throw new UnauthorizedException();
    return user;
  }
}
