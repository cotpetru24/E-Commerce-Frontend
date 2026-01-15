import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!environment.production) {
      console.log('[API REQUEST]', {
        method: req.method,
        url: req.url,
        body: req.body,
      });
    }

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (!environment.production && event instanceof HttpResponse) {
            console.log('[API RESPONSE]', {
              url: req.url,
              status: event.status,
              body: event.body,
            });
          }
        },
        error: (error) => {
          if (!environment.production) {
            console.error('[API ERROR]', {
              url: req.url,
              error,
            });
          }
        },
      })
    );
  }
}
