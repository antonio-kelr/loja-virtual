import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

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

  get precoParcelado(): number {
    return this.produto.precoAtual / 10;
  }
}
