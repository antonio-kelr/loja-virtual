import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart, faHeart, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { MegaMenuComponent } from "../mega-menu/mega-menu.component";
import { CarrinhoService } from '../../services/carrinho.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/user-profile.model';
import { MenuModule } from 'primeng/menu';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, MenubarModule, DialogModule, InputTextModule, FontAwesomeModule, MegaMenuComponent, CommonModule, RouterLink, MenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  faShoppingCart = faShoppingCart;
  faHeart = faHeart;
  faChevronDown = faChevronDown;
  qtdItensCarrinho: number = 0;
  userProfile: UserProfile | null = null;
  isLoggedIn = false;

  getPrimeiroNome(): string {
    if (!this.userProfile?.nome) return '';
    return this.userProfile.nome.split(' ')[0];
  }

  constructor(
    private carrinhoService: CarrinhoService,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Inscreve-se para receber atualizações do carrinho
    this.carrinhoService.getCarrinho().subscribe(itens => {
      this.qtdItensCarrinho = itens.length;
    });

    // Observar mudanças no estado do usuário
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.loadUserProfile();
      } else {
        this.userProfile = null;
      }
    });
  }

  private loadUserProfile() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      console.log('Usuário não está autenticado');
      this.userProfile = null;
      this.isLoggedIn = false;
      return;
    }

    console.log('Carregando perfil do usuário...');
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.isLoggedIn = true;
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
        this.userProfile = null;
        this.isLoggedIn = false;
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      }
    });
  }

  logout() {
    this.authService.logout();
    this.userProfile = null;
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  irParaCarrinho() {
    this.router.navigate(['/carrinho']);
  }
  irParaFavorito() {
    this.router.navigate(['minha-conta/meus-favoritos']);
  }
}
