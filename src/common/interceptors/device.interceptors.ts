import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import nanoid = require('nanoid');
import { Request, Response } from 'express';

@Injectable()
export class DeviceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request & { deviceId?: string } = context
      .switchToHttp()
      .getRequest();

    const res: Response = context.switchToHttp().getResponse();

    const { headers } = req;

    const deviceId =
      headers['deviceId'] ?? req.cookies['deviceId'] ?? nanoid.nanoid(24);
    req.deviceId = deviceId;

    res.cookie('deviceId', deviceId, {
      sameSite: 'none',
      expires: new Date(Date.now() + 315360000000),
      httpOnly: true,
      secure: true,
    });

    res.header('deviceId', deviceId);

    return next.handle().pipe(map((data) => data));
  }
}
