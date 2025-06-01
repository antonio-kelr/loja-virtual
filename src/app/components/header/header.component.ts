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
  imports: [ButtonModule, MenubarModule, DialogModule, InputTextModule, FontAwesomeModule, MegaMenuComponent, CommonModule,RouterLink, MenuModule],
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

    // Verificar se está no navegador antes de acessar localStorage
    if (isPlatformBrowser(this.platformId)) {
      // Verificar se já existe um token
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
        this.loadUserProfile();
      }
    }

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
    console.log('Carregando perfil do usuário...');
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        console.log('Perfil carregado:', profile);
        this.userProfile = profile;
      },
      error: (error) => {
        console.error('Erro ao carregar perfil:', error);
        this.userProfile = null;
      }
    });
  }

  irParaCarrinho() {
    this.router.navigate(['/carrinho']);
  }

  logout() {
    alert('teste');
    // // Limpar dados do usuário
    // this.userProfile = null;
    // this.isLoggedIn = false;
    // // Redirecionar para a página inicial
    // this.router.navigate(['/']);
  }
}
