import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ProcessoCompraComponent } from '../processo-compra/processo-compra.component';

@Component({
  selector: 'app-confirmacao',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ProcessoCompraComponent
  ],
  templateUrl: './confirmacao.component.html',
  styleUrls: ['./confirmacao.component.scss']
})
export class ConfirmacaoComponent implements OnInit {
  metodoPagamento: string = '';
  valorTotal: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.metodoPagamento = params['metodoPagamento'] || 'pix';
      this.valorTotal = Number(params['valor']) || 0;
    });
  }

  getMetodoPagamentoFormatado(): string {
    switch(this.metodoPagamento) {
      case 'pix':
        return 'PIX (10% de desconto)';
      case 'cartao':
        return 'Cartão de Crédito';
      case 'boleto':
        return 'Boleto Bancário';
      default:
        return 'Não especificado';
    }
  }

  voltarParaHome(): void {
    this.router.navigate(['/']);
  }
}
