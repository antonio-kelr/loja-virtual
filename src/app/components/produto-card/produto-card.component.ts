import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-produto-card',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './produto-card.component.html',
  styleUrls: ['./produto-card.component.scss']
})
export class ProdutoCardComponent {
  @Input() produto: any;
  faShoppingCart = faShoppingCart;

  constructor(
    private router: Router,
    private carrinhoService: CarrinhoService
  ) {}

  get precoParcelado(): number {
    return this.produto.precoAtual / 10;
  }

  verDetalhes(produto: any) {
    this.router.navigate(['/produto', produto.id]);
  }

  comprarAgora(produto: any) {
    // Adiciona ao carrinho primeiro
    this.carrinhoService.adicionarAoCarrinho(produto);

    // Navega diretamente para a página do carrinho
    this.router.navigate(['/carrinho']);
  }
}
