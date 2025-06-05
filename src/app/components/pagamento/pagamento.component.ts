import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResumoCarrinhoComponent } from '../resumo-carrinho/resumo-carrinho.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CarrinhoService } from '../../services/carrinho.service';
import { CheckoutStepsComponent } from '../checkout-steps/checkout-steps.component';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    ResumoCarrinhoComponent,
    CheckoutStepsComponent
  ],
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit {
  totalCarrinho: number = 0;
  formaPagamentoSelecionada: string = 'pix';
  descontoPix: number = 0.1; // 10% de desconto

  constructor(
    private carrinhoService: CarrinhoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarCarrinho();
  }

  carregarCarrinho(): void {
    this.totalCarrinho = this.carrinhoService.calcularTotal();
  }

  calcularValorComDesconto(): number {
    if (this.formaPagamentoSelecionada === 'pix') {
      return this.totalCarrinho * (1 - this.descontoPix);
    }
    return this.totalCarrinho;
  }

  calcularEconomia(): number {
    if (this.formaPagamentoSelecionada === 'pix') {
      return this.totalCarrinho * this.descontoPix;
    }
    return 0;
  }

  concluirPagamento(): void {
    const valorFinal = this.calcularValorComDesconto();

    this.router.navigate(['/confirmacao'], {
      queryParams: {
        metodoPagamento: this.formaPagamentoSelecionada,
        valor: valorFinal,
        desconto: this.calcularEconomia()
      }
    });
  }

  voltarAoCarrinho(): void {
    this.router.navigate(['/carrinho']);
  }
}
