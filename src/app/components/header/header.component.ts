import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart, faHeart, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { MegaMenuComponent } from "../mega-menu/mega-menu.component";
import { CarrinhoService } from '../../services/carrinho.service';
import { FavoritoService } from '../../services/favorito.service';
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
  qtdFavoritos: number = 0;
  userProfile: UserProfile | null = null;
  isLoggedIn = false;
  favoritos: any[] = []; // Array para armazenar os favoritos

  getPrimeiroNome(): string {
    if (!this.userProfile?.nome) return '';
    return this.userProfile.nome.split(' ')[0];
  }

  constructor(
    private carrinhoService: CarrinhoService,
    private favoritoService: FavoritoService,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Inscreve-se para receber atualizações do carrinho
    this.carrinhoService.getCarrinho().subscribe(itens => {
      this.qtdItensCarrinho = itens.length;
    });

    // Inscreve-se para receber atualizações dos favoritos
    this.favoritoService.getQuantidadeFavoritos().subscribe(quantidade => {
      this.qtdFavoritos = quantidade;
    });

    // Observar mudanças no estado do usuário
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.loadUserProfile();
        // Carrega o carrinho do servidor quando o usuário está logado
        this.carregarCarrinhoDoServidor();
        // Carrega os favoritos do servidor quando o usuário está logado
        this.carregarFavoritosDoServidor();
      } else {
        this.userProfile = null;
        this.qtdItensCarrinho = 0; // Zera o carrinho quando deslogado
        this.qtdFavoritos = 0; // Zera os favoritos quando deslogado
      }
    });
  }

  private carregarCarrinhoDoServidor() {
    this.carrinhoService.buscarCarrinhoDoServidor().subscribe({
      next: (carrinho) => {
        if (carrinho && carrinho.itens) {
          this.qtdItensCarrinho = carrinho.itens.length;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar carrinho no header:', error);
        this.qtdItensCarrinho = 0;
      }
    });
  }

  private carregarFavoritosDoServidor() {
    this.favoritoService.getFavoritos().subscribe({
      next: (favoritos) => {
        if (favoritos && Array.isArray(favoritos)) {
          this.favoritos = favoritos;
          this.qtdFavoritos = favoritos.length;
        }
      },
      error: (error) => {
        console.error('Erro ao carregar favoritos no header:', error);
        this.qtdFavoritos = 0;
      }
    });
  }

  toggleFavorito(produtoId: number) {
    // Verifica se o produto já está nos favoritos
    const isFavorito = this.favoritos.some(fav => fav.produtoId === produtoId);

    if (isFavorito) {
      // Remove dos favoritos
      this.favoritoService.deletetFavorito(produtoId).subscribe({
        next: () => {
          console.log('Produto removido dos favoritos');
        },
        error: (error) => {
          console.error('Erro ao remover dos favoritos:', error);
        }
      });
    } else {
      // Adiciona aos favoritos
      this.favoritoService.postFavorito(produtoId).subscribe({
        next: () => {
          console.log('Produto adicionado aos favoritos');
        },
        error: (error) => {
          console.error('Erro ao adicionar aos favoritos:', error);
        }
      });
    }
  }

  isFavorito(produtoId: number): boolean {
    return this.favoritos.some(fav => fav.produtoId === produtoId);
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
