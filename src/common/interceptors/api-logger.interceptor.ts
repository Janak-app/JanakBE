import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { ApiLog } from '../../modules/api-logs/entities/api-log.entity';

const SENSITIVE_FIELDS = new Set(['password', 'token', 'refreshToken', 'accessToken', 'secret', 'cvv']);

function sanitize(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  const result: Record<string, unknown> = { ...(obj as Record<string, unknown>) };
  for (const key of Object.keys(result)) {
    if (SENSITIVE_FIELDS.has(key)) {
      result[key] = '***';
    } else if (typeof result[key] === 'object') {
      result[key] = sanitize(result[key]);
    }
  }
  return result;
}

function safeSerialize(data: unknown): Record<string, any> | null {
  try {
    return JSON.parse(JSON.stringify(sanitize(data)));
  } catch {
    return null;
  }
}

@Injectable()
export class ApiLoggerInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(ApiLog)
    private readonly apiLogRepository: Repository<ApiLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      body?: unknown;
      ip?: string;
      user?: { id?: string; email?: string };
      headers: Record<string, string | string[] | undefined>;
    }>();

    // Skip logging for the admin logs endpoint to avoid noise
    if (req.url.includes('/admin/logs')) {
      return next.handle();
    }

    const startTime = Date.now();
    const method = req.method;
    const path = req.url;
    const payload = req.body ? safeSerialize(req.body) : null;
    const userId = req.user?.id ?? null;
    const userEmail = req.user?.email ?? null;
    const ip = (req.headers['x-forwarded-for'] as string) ?? req.ip ?? null;
    const userAgent = (req.headers['user-agent'] as string) ?? null;

    const saveLog = (response: unknown, statusCode: number) => {
      const durationMs = Date.now() - startTime;
      this.apiLogRepository
        .save({
          userId,
          userEmail,
          method,
          path,
          payload,
          response: safeSerialize(response),
          statusCode,
          ip,
          userAgent,
          durationMs,
        })
        .catch(() => {
          // Silently fail — logging must never crash the request
        });
    };

    return next.handle().pipe(
      tap((responseData) => {
        const res = context.switchToHttp().getResponse<{ statusCode: number }>();
        saveLog(responseData, res.statusCode);
      }),
      catchError((err: { message?: string; status?: number }) => {
        saveLog({ error: err.message }, err.status ?? 500);
        return throwError(() => err);
      }),
    );
  }
}
