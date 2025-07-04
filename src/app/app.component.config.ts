import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

// ============================================================================
// HTTP CLIENT SETUP EXAMPLES
// ============================================================================

// To enable HTTP requests, you need to import and provide HttpClientModule
// Uncomment the following imports and add to providers:

// import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    
    // ============================================================================
    // BASIC HTTP CLIENT SETUP
    // ============================================================================
    
    // Uncomment this line to enable HTTP requests:
    // provideHttpClient(),
    
    // ============================================================================
    // ADVANCED HTTP CLIENT SETUP WITH INTERCEPTORS
    // ============================================================================
    
    // Uncomment these lines for advanced HTTP setup:
    // provideHttpClient(
    //   withFetch(), // Use fetch API instead of XMLHttpRequest
    //   withInterceptors([
    //     // Add authentication interceptor
    //     authInterceptor,
    //     // Add logging interceptor
    //     loggingInterceptor,
    //     // Add error handling interceptor
    //     errorInterceptor
    //   ])
    // ),
    
    // ============================================================================
    // EXAMPLE INTERCEPTORS (define these in separate files)
    // ============================================================================
    
    /*
    // Authentication Interceptor
    // File: src/app/interceptors/auth.interceptor.ts
    export const authInterceptor: HttpInterceptorFn = (req, next) => {
      // Get token from localStorage or service
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Clone the request and add authorization header
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(authReq);
      }
      
      return next(req);
    };
    
    // Logging Interceptor
    // File: src/app/interceptors/logging.interceptor.ts
    export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
      const startTime = Date.now();
      
      return next(req).pipe(
        tap(response => {
          const endTime = Date.now();
          const duration = endTime - startTime;
          console.log(`${req.method} ${req.url} - ${duration}ms`);
        })
      );
    };
    
    // Error Handling Interceptor
    // File: src/app/interceptors/error.interceptor.ts
    export const errorInterceptor: HttpInterceptorFn = (req, next) => {
      return next(req).pipe(
        catchError(error => {
          if (error.status === 401) {
            // Handle unauthorized - redirect to login
            console.log('Unauthorized - redirecting to login');
            // router.navigate(['/login']);
          } else if (error.status === 500) {
            // Handle server errors
            console.error('Server error:', error);
          }
          
          return throwError(() => error);
        })
      );
    };
    */
  ]
};
