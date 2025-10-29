import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly platformId = inject(PLATFORM_ID);
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.auth.getToken();

    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        },
      });
      return next.handle(clonedReq).pipe(
        catchError((err: HttpErrorResponse) => this.handleAuthError(err))
      );
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => this.handleAuthError(err))
    );
  }

  private handleAuthError(err: HttpErrorResponse) {
    const status = err?.status;
    // Laravel may return 401 (Unauthorized) or 419 (CSRF/expired) or sometimes 403 for forbidden
    if (status === 401 || status === 419) {
      this.auth.logout();
      // Avoid server-side navigation during SSR
      if (isPlatformBrowser(this.platformId)) {
        // If already on /login, do nothing; else redirect
        try {
          this.router.navigate(['/login']);
        } catch {}
      }
    }
    return throwError(() => err);
  }
}
