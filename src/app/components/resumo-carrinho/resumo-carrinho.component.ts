import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-resumo-carrinho',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumo-carrinho.component.html',
  styleUrls: ['./resumo-carrinho.component.scss']
})
export class ResumoCarrinhoComponent implements OnInit {
  @Input() totalCarrinho: number = 0;
  @Input() mostrarBotoes: boolean = true;
  @Input() botaoPrincipal: string = 'Finalizar Compra';
  @Input() botaoSecundario: string = 'Continuar Comprando';

  @Output() continuar = new EventEmitter<void>();
  @Output() voltarAtras = new EventEmitter<void>();

  itensCarrinho: any[] = [];
  subtotal: number = 0;
  total: number = 0;

  constructor(private carrinhoService: CarrinhoService) {}

  ngOnInit(): void {
    this.carregarCarrinho();
  }

  carregarCarrinho(): void {
    this.carrinhoService.buscarCarrinhoDoServidor().subscribe({
      next: (response) => {
        console.log('Resposta do carrinho:', response);
        this.itensCarrinho = response.itens || [];
        this.calcularTotais();
      },
      error: (error) => {
        console.error('Erro ao carregar carrinho:', error);
        this.subtotal = 0;
        this.total = 0;
      }
    });
  }

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
}
