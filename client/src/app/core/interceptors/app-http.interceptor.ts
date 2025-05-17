import { HttpInterceptorFn } from '@angular/common/http';
import {AuthService} from '../services/auth/auth.service';
import {inject} from '@angular/core';
import {catchError, throwError} from 'rxjs';

export const appHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService)
  const token: string = authService.accessToken;

  if (!req.url.includes('login')) {
    let request = token
      ? req.clone({headers: req.headers.set('Authorization', `Bearer ${token}`)})
      : req;
    return next(request).pipe(
      catchError( err => {
        if (err.status === 401) {
          authService.logout();
        }

        return throwError(err.message)
      })
    );
  }

  return next(req);
};
