import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthApiService } from '../../services/api/auth-api.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authApiService: AuthApiService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authApiService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
