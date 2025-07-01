import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrinhoService } from '../../services/carrinho.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-resumo-carrinho',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './resumo-carrinho.component.html',
  styleUrls: ['./resumo-carrinho.component.scss']
})
export class ResumoCarrinhoComponent  {
  @Input() totalCarrinho: number = 0;
  @Input() mostrarBotoes: boolean = true;
  @Input() botaoPrincipal: string = 'Finalizar Compra';
  @Input() botaoSecundario: string = 'Continuar Comprando';
  @Input() metodoPagamento: string = 'pix';

  @Output() continuar = new EventEmitter<void>();
  @Output() voltarAtras = new EventEmitter<void>();

  itensCarrinho: any[] = [];
  subtotal: number = 0;
  total: number = 0;
  clipboardList = faClipboardList;

  constructor(private carrinhoService: CarrinhoService) {}



  calcularTotais(): void {
    try {
      this.subtotal = this.itensCarrinho.reduce((total, item) => {
        return total + (item.subtotal || 0);
      }, 0);

      this.total = this.subtotal;

      console.log('Subtotal calculado:', this.subtotal);
      console.log('Total calculado:', this.total);
    } catch (error) {
      console.error('Erro ao calcular totais:', error);
      this.subtotal = 0;
      this.total = 0;
    }
  }

  calcularDesconto(): number {
    switch (this.metodoPagamento.toLowerCase()) {
      case 'pix':
        return 0.98; // 2% de desconto
      case 'cartao':
        return 1;    // Sem desconto
      case 'boleto':
        return 0.99; // ✅ Agora só 1% de desconto
      default:
        return 1;
    }
  }
  }
