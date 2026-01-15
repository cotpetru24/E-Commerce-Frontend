import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../../services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('/api/auth')) {
      return next.handle(req);
    }

    const token = this.storageService.getSessionItem('accessToken');
    if (!token) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
  }
}
