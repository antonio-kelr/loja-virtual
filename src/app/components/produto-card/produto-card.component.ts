import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  get precoParcelado(): number {
    return this.produto.precoAtual / 10;
  }

  comprarAgora(produto: any) {
    // Navegação para a página de checkout com o produto selecionado
    // Em um caso real, você poderia usar um serviço para compartilhar os dados do produto
    // ou usar parâmetros de rota ou estado de navegação
    localStorage.setItem('produtoCompra', JSON.stringify(produto));
    this.router.navigate(['/checkout']);
  }
}
