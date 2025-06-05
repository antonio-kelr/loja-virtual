import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResumoCarrinhoComponent } from '../resumo-carrinho/resumo-carrinho.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CarrinhoService } from '../../services/carrinho.service';
import { CheckoutStepsComponent } from '../checkout-steps/checkout-steps.component';
import { Carrinho } from '../../interfaces/carrinho.interface';
import { NavComponent } from "../nav/nav.component";

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    ResumoCarrinhoComponent,
    CheckoutStepsComponent,
    NavComponent
],
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit {
  totalCarrinho: number = 0;
  formaPagamentoSelecionada: string = 'pix';
  descontoPix: number = 0.1; // 10% de desconto
  etapaAtual: number = 2;

  constructor(
    private carrinhoService: CarrinhoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarCarrinho();
  }

  carregarCarrinho(): void {
    this.carrinhoService.buscarCarrinhoDoServidor().subscribe({
      next: (carrinho: Carrinho) => {
        this.totalCarrinho = carrinho.total;
      },
      error: (error) => {
        console.error('Erro ao carregar carrinho:', error);
      }
    });
  }

  calcularValorComDesconto(): number {
    switch (this.formaPagamentoSelecionada) {
      case 'pix':
        return this.totalCarrinho * 0.9; // 10% de desconto
      case 'boleto':
        return this.totalCarrinho * 0.95; // 5% de desconto
      default:
        return this.totalCarrinho;
    }
  }

  calcularEconomia(): number {
    switch (this.formaPagamentoSelecionada) {
      case 'pix':
        return this.totalCarrinho * 0.1; // 10% de desconto
      case 'boleto':
        return this.totalCarrinho * 0.05; // 5% de desconto
      default:
        return 0;
    }
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
