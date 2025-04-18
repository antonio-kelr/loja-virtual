import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumo-carrinho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumo-carrinho.component.html',
  styleUrls: ['./resumo-carrinho.component.scss']
})
export class ResumoCarrinhoComponent {
  @Input() totalCarrinho: number = 0;
  @Input() mostrarBotoes: boolean = true;
  @Input() botaoPrincipal: string = 'Finalizar Compra';
  @Input() botaoSecundario: string = 'Continuar Comprando';

  @Output() continuar = new EventEmitter<void>();
  @Output() voltarAtras = new EventEmitter<void>();
}
