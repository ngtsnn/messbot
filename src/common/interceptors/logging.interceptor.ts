import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { logWithResTime } from "src/utils/misc";


@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, body, url } = req;
    const then = Date.now();
    Logger.log(
      `
        Request: ${method} - ${url}
        Body: ${JSON.stringify(body)}
        At: ${then}
      `
    );

    return next.handle().pipe(
      tap((data) =>
        logWithResTime({
          data,
          from: then,
          to: Date.now(),
          method,
          payload: body || {},
          request: url,
        })
      )
    );
  }
}
