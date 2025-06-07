import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CheckoutStepsComponent } from '../checkout-steps/checkout-steps.component';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-concluir',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    CheckoutStepsComponent,
    QRCodeComponent
  ],
  templateUrl: './concluir.component.html',
  styleUrls: ['./concluir.component.scss']
})
export class ConcluirComponent implements OnInit {
  etapaAtual = 4;
  metodoPagamento: string = '';
  valorTotal: number = 0;
  qrCodeValue: string = '98984158711'; // Valor inicial para evitar erro de QR Code vazio

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['metodoPagamento']) {
        this.metodoPagamento = params['metodoPagamento'];
      }
      if (params['valor']) {
        // Converter o valor para número
        this.valorTotal = Number(params['valor']);
        // Gerar o valor do QR Code com a chave PIX e o valor
        this.gerarQRCodePix();
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
