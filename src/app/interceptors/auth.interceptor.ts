import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return next(request);
  }

  const token = localStorage.getItem('token');

  if (token) {
    try {
      // Decodifica o token JWT
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000; // Converte para milissegundos
      const currentTime = new Date().getTime();

      // Verifica se o token expirou
      if (currentTime >= expirationTime) {
        // Token expirado, limpa o localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        return throwError(() => new Error('Token expirado'));
      }

      // Adiciona o token ao header da requisição
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      return throwError(() => new Error('Token inválido'));
    }
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
      return throwError(() => error);
    })
  );
};
