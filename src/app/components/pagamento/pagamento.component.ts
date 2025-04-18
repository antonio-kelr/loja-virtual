import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProcessoCompraComponent } from '../processo-compra/processo-compra.component';
import { ResumoCarrinhoComponent } from '../resumo-carrinho/resumo-carrinho.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    ProcessoCompraComponent,
    ResumoCarrinhoComponent
  ],
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.scss']
})
export class PagamentoComponent implements OnInit {
  totalCarrinho: number = 0;
  formaPagamentoSelecionada: string = 'pix';

  constructor(
    private carrinhoService: CarrinhoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.totalCarrinho = this.carrinhoService.calcularTotal();
  }

  concluirPagamento(): void {
    // Calcular o valor total considerando o desconto para PIX
    let valorFinal = this.totalCarrinho;
    if (this.formaPagamentoSelecionada === 'pix') {
      // Aplicar 10% de desconto para pagamento via PIX
      valorFinal = this.totalCarrinho * 0.9;
    }

    // Navegar para a página de confirmação com os parâmetros
    this.router.navigate(['/confirmacao'], {
      queryParams: {
        metodoPagamento: this.formaPagamentoSelecionada,
        valor: valorFinal
      }
    });
  }

  voltarAoCarrinho(): void {
    this.router.navigate(['/carrinho']);
  }
}
