import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';
import { LoggingInterceptor } from './app/core/interceptors/logging.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
});
