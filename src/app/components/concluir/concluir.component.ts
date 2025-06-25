import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CheckoutStepsComponent } from '../checkout-steps/checkout-steps.component';
import { QRCodeComponent } from 'angularx-qrcode';
import { log } from 'node:console';

@Component({
  selector: 'app-concluir',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    CheckoutStepsComponent,
    QRCodeComponent,
  ],
  templateUrl: './concluir.component.html',
  styleUrls: ['./concluir.component.scss'],
})
export class ConcluirComponent implements OnInit {
  etapaAtual = 4;
  metodoPagamento: string = '';
  valorTotal: number = 0;
  qrCodeValue: string = '98984158711'; // Valor inicial para evitar erro de QR Code vazio
  enderecoId: number | null = null;
  itensCarrinho: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['metodoPagamento']) {
        this.metodoPagamento = params['metodoPagamento'];
      }
      if (params['valor']) {
        // Converter o valor para número
        this.valorTotal = Number(params['valor']);
        // Gerar o valor do QR Code com a chave PIX e o valor
        this.gerarQRCodePix();
      }
      if (params['enderecoId']) {
        this.enderecoId = Number(params['enderecoId']);
        console.log('indereço:', this.enderecoId);

      }
      if (params['itens']) {
        try {
          this.itensCarrinho = JSON.parse(params['itens']);
          console.log('itens carrinho:', this.itensCarrinho);

        } catch (e) {
          console.error('Erro ao converter itens do carrinho:', e);
        }
      }
      const userId = localStorage.getItem('userId');

      if (userId) {
        const userIdNumber = Number(userId);
        console.log('ID do usuário:', userIdNumber);
      } else {
        console.warn(
          'Usuário não está logado ou o ID não foi salvo no localStorage.'
        );
      }
    });
  }

  private gerarQRCodePix(): void {
    try {
      // Chave PIX (CPF)
      const chavePix = '98984158711';

      // Formatar o valor para o padrão PIX
      const valorFormatado = this.valorTotal.toFixed(2).replace('.', ',');

      // Gerar o payload do PIX
      this.qrCodeValue = `00020126580014BR.GOV.BCB.PIX0136${chavePix}52040000530398654040${valorFormatado}5802BR5913LOJA VIRTUAL6008BRASILIA62070503***6304E2CA`;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      // Em caso de erro, mantém a chave PIX como valor padrão
      this.qrCodeValue = '98984158711';
    }
  }

  voltarParaHome(): void {
    this.router.navigate(['/']);
  }
}
