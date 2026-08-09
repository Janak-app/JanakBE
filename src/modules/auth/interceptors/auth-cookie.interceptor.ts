import { CallHandler, ExecutionContext, Injectable, NestInterceptor, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import { map, Observable } from 'rxjs';

export const CLEAR_AUTH_COOKIE_KEY = 'clear_auth_cookie';
export const ClearAuthCookie = () => SetMetadata(CLEAR_AUTH_COOKIE_KEY, true);

function getCookieOptions(req: Request) {
  const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https';
  return {
    httpOnly: true,
    secure: isHttps,
    sameSite: (isHttps ? 'none' : 'lax') as 'none' | 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  };
}

@Injectable()
export class AuthCookieInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const shouldClear = this.reflector.getAllAndOverride<boolean>(CLEAR_AUTH_COOKIE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    const cookieOptions = getCookieOptions(req);

    return next.handle().pipe(
      map((data) => {
        if (shouldClear) {
          res.clearCookie('accessToken', cookieOptions);
          return data;
        }
        if (data?.accessToken) {
          res.cookie('accessToken', data.accessToken, cookieOptions);
          return data;
        }
        return data;
      }),
    );
  }
}
