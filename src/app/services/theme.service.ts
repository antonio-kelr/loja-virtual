import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isHomePage = true;
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    // Monitorar mudanças de rota
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Verificar se estamos na rota principal (home)
      this.isHomePage = event.url === '/' || event.url === '';

      // Se não estiver na home, definir o background como branco
      if (!this.isHomePage) {
        this.resetBodyBackground();
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode.next(savedTheme === 'dark');
        this.applyTheme(savedTheme === 'dark');
      }
    }
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const newTheme = !this.isDarkMode.value;
      this.isDarkMode.next(newTheme);
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      this.applyTheme(newTheme);
    }
  }

  private applyTheme(isDark: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      if (isDark) {
        document.body.classList.add('dark-theme');
        document.body.style.backgroundColor = '#1a1a1a';
      } else {
        document.body.classList.remove('dark-theme');
        document.body.style.backgroundColor = '#ffffff';
      }
    }
  }

  // Método para redefinir o background do body (usado nas páginas que não são a home)
  resetBodyBackground() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.backgroundColor = this.isDarkMode.value ? '#1a1a1a' : '#ffffff';
    }
  }

  // Verifica se estamos na página inicial
  getIsHomePage(): boolean {
    return this.isHomePage;
  }

  // Método chamado pelo componente de carrossel para definir a cor
  // Só será aplicado se estivermos na home
  setBackgroundColor(color: string) {
    if (this.isHomePage) {
      document.body.style.backgroundColor = color;
    }
  }
}
