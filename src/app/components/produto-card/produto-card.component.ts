import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart, faCartPlus } from '@fortawesome/free-solid-svg-icons';
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
  faCartPlus = faCartPlus;

  constructor(
    private router: Router
  ) {}

  get precoParcelado(): number {
    return this.produto.preco / 10;
  }

  verDetalhes(produto: any) {
    this.router.navigate(['/produto', produto.slug]);
  }
}
