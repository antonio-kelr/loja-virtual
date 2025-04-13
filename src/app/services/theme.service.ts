import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isHomePage = true;

  constructor(private router: Router) {
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
  }

  // Método para redefinir o background do body (usado nas páginas que não são a home)
  resetBodyBackground() {
    document.body.style.backgroundColor = '#ffffff';
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
