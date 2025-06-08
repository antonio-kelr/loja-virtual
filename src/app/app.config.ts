import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Lara
      }
    })
  ]
};
