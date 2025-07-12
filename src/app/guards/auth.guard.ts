import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

export const AuthGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  return authService.user$.pipe(
    take(1),
    map(user => {
      // Verifica se estamos no navegador
      if (!isPlatformBrowser(platformId)) {
        return false;
      }

      const token = localStorage.getItem('token');

      if (!token) {
        router.navigate(['/login']);
        return false;
      }

      try {
        // Decodifica o token JWT
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenPayload.exp * 1000; // Converte para milissegundos
        const currentTime = new Date().getTime();

        // Verifica se o token expirou
        if (currentTime >= expirationTime) {
          // Token expirado, limpa o localStorage e redireciona para login
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          router.navigate(['/login']);
          return false;
        }

        // Verifica se o usuário é admin
        if (tokenPayload.role !== 'admin') {
          // Não é admin, não deixa entrar
          return false;
        }

        // Token válido, usuário autenticado e é admin
        return true;
      } catch (error) {
        // Erro ao decodificar o token
        console.error('Erro ao verificar token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
