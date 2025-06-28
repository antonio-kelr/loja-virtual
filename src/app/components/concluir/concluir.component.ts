import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CheckoutStepsComponent } from '../checkout-steps/checkout-steps.component';
import { QRCodeComponent } from 'angularx-qrcode';
import { PedidoService } from '../../services/pedido.service';

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
  userId: number | null = null; // <- Adicione isso!

  constructor(private router: Router, private route: ActivatedRoute, private  pedidoService:PedidoService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['metodoPagamento']) {
        this.metodoPagamento = params['metodoPagamento'];
      }

      if (params['valor']) {
        this.valorTotal = Number(params['valor']);
        this.gerarQRCodePix();
      }

      if (params['enderecoId']) {
        this.enderecoId = Number(params['enderecoId']);
        console.log('endereço:', this.enderecoId);
      }

      if (params['itens']) {
        try {
          this.itensCarrinho = JSON.parse(params['itens']);
          console.log('itens carrinho:', this.itensCarrinho);
        } catch (e) {
          console.error('Erro ao converter itens do carrinho:', e);
        }
      }

      // CORRIGIDO: Salva o ID do usuário na propriedade da classe
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.userId = Number(userId);
        console.log('ID do usuário:', this.userId);
      } else {
        console.warn('Usuário não está logado ou o ID não foi salvo no localStorage.');
      }

      // Verifica se tudo está pronto para enviar o pedido
      if (this.userId && this.enderecoId && this.itensCarrinho.length > 0) {
        const payload = {
          userId: this.userId,
          EnderecoId: this.enderecoId,
          itens: this.itensCarrinho,
        };

        console.log('dados AQUII', payload);

        this.pedidoService.criarPedido(payload).subscribe({
          next: (res) => {
            console.log('Pedido criado com sucesso:', res);
          },
          error: (err) => {
            console.error('Erro ao criar pedido:', err);
          }
        });
      }
    });
  }

  private gerarQRCodePix(): void {
    try {
      const chavePix = '98984158711';
      const valorFormatado = this.valorTotal.toFixed(2).replace('.', ',');
      this.qrCodeValue = `00020126580014BR.GOV.BCB.PIX0136${chavePix}52040000530398654040${valorFormatado}5802BR5913LOJA VIRTUAL6008BRASILIA62070503***6304E2CA`;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      this.qrCodeValue = '98984158711';
    }
  }

  voltarParaHome(): void {
    this.router.navigate(['/']);
  }
}
