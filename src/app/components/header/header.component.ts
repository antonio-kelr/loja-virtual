import { Component, OnInit, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart, faHeart, faChevronDown, faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { MegaMenuComponent } from "../mega-menu/mega-menu.component";
import { CarrinhoService } from '../../services/carrinho.service';
import { FavoritoService } from '../../services/favorito.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/user-profile.model';
import { MenuModule } from 'primeng/menu';
import { isPlatformBrowser } from '@angular/common';
import { ProdutoService } from '../../services/produto.service';
import { FormsModule } from '@angular/forms';
import { Produto } from '../../interfaces/produto.interface';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, MenubarModule, DialogModule, InputTextModule, FontAwesomeModule, MegaMenuComponent, CommonModule, RouterLink, MenuModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  faShoppingCart = faShoppingCart;
  faHeart = faHeart;
  faChevronDown = faChevronDown;
  faTimes = faTimes;
  faBars = faBars;
  qtdItensCarrinho: number = 0;
  qtdFavoritos: number = 0;
  userProfile: UserProfile | null = null;
  isLoggedIn = false;
  showMobileMenu: boolean = false;
  favoritos: any[] = []; // Array para armazenar os favoritos
  searchTerm: string = '';
  suggestedProducts: Produto[] = [];
  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  getPrimeiroNome(): string {
    if (!this.userProfile?.nome) return '';
    return this.userProfile.nome.split(' ')[0];
  }

  constructor(
    private carrinhoService: CarrinhoService,
    private favoritoService: FavoritoService,
    private router: Router,
    private authService: AuthService,
    private produtoService: ProdutoService,
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

    // Lógica para autocompletar
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(300), // Espera 300ms após a última digitação
      distinctUntilChanged() // Ignora se o termo de busca não mudou
    ).subscribe(searchTerm => {
      if (searchTerm.length > 2) { // Busca apenas se o termo tiver mais de 2 caracteres
        this.produtoService.searchProdutos(searchTerm).subscribe({
          next: (produtos) => {
            this.suggestedProducts = produtos.slice(0, 10); // Limita a 10 sugestões
          },
          error: (error) => {
            console.error('Erro ao buscar produtos para autocompletar:', error);
            this.suggestedProducts = [];
          }
        });
      } else {
        this.suggestedProducts = []; // Limpa as sugestões se o termo for muito curto
      }
    });
  }

  onSearchTermChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  selectProductSuggestion(product: Produto) {
    this.searchTerm = product.nome; // Define o termo de busca com o nome do produto selecionado
    this.suggestedProducts = []; // Limpa as sugestões
    if (product.slug) {
      this.router.navigate(['/produto', product.slug]);
    } else {
      // Fallback case if slug is not available (though it should be)
      this.router.navigate(['/produto'], { queryParams: { search: product.nome } });
    }
  }

  private carregarCarrinhoDoServidor() {
    this.carrinhoService.buscarCarrinhoDoServidor().subscribe({
      next: (carrinho) => {
        if (carrinho && carrinho.itens) {
          this.qtdItensCarrinho = carrinho.itens.length;
        }
      },
      error: (error) => {
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

  search() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/produto'], { queryParams: { search: this.searchTerm } });
      this.suggestedProducts = []; // Limpa as sugestões após a busca
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.suggestedProducts = [];
    // Opcional: navegar para a página inicial ou de produtos sem filtro
    this.router.navigate(['/produto']);
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}
