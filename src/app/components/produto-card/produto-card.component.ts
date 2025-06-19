import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FavoritoService } from '../../services/favorito.service';

@Component({
  selector: 'app-produto-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ToastModule],
  providers: [MessageService],
  templateUrl: './produto-card.component.html',
  styleUrls: ['./produto-card.component.scss']
})
export class ProdutoCardComponent {
  @Input() produto: any;
  faShoppingCart = faShoppingCart;
  faCartPlus = faCartPlus;

  constructor(
    private router: Router,
    private carrinhoService: CarrinhoService,
    private messageService: MessageService,
    private favoritoService: FavoritoService
  ) {}

  get precoParcelado(): number {
    return this.produto.preco / 10;
  }

  verDetalhes(produto: any) {
    this.router.navigate(['/produto', produto.slug]);
  }

  adicionarAoCarrinho(event: Event) {
    event.stopPropagation(); // Impede que o evento de clique se propague para o card

    console.log('Produto a ser adicionado:', this.produto);

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Usuário não está logado');
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Você precisa estar logado para adicionar produtos ao carrinho.'
      });
      return;
    }

    console.log('Enviando ID do produto:', this.produto.id);
    this.carrinhoService.adicionarAoCarrinho(this.produto.id).subscribe({
      next: (response) => {
        console.log('Produto adicionado com sucesso:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto adicionado ao carrinho!'
        });
      },
      error: (erro) => {
        console.error('Erro detalhado ao adicionar ao carrinho:', {
          status: erro.status,
          statusText: erro.statusText,
          url: erro.url,
          error: erro.error,
          message: erro.message
        });
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível adicionar o produto ao carrinho.'
        });
      }
    });
  }

  adicionarAosFavoritos(event: Event) {
    event.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Você precisa estar logado para adicionar produtos aos favoritos.'
      });
      return;
    }
    this.favoritoService.postFavorito(this.produto.id).subscribe({
      next: (response) => {
        console.log('Produto adicionado com sucesso:', response);

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto adicionado aos favoritos!'
        });
      },
      error: (erro) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível adicionar o produto aos favoritos.'
        });
      }
    });
  }
}
