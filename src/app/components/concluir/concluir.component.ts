import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CheckoutStepsComponent } from '../checkout-steps/checkout-steps.component';
import { QRCodeComponent } from 'angularx-qrcode';
import { PedidoService } from '../../services/pedido.service';
import { CarrinhoService } from '../../services/carrinho.service';

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
  userId: number | null = null;
  carrinhoId: number | null = null;
  pedidoCriado = false; // Flag para controlar se o pedido já foi criado

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log('Parâmetros recebidos:', params);

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

          // Verifica a estrutura dos itens
          if (this.itensCarrinho.length > 0) {
            console.log('Estrutura do primeiro item:', this.itensCarrinho[0]);
            console.log('Propriedades do primeiro item:', Object.keys(this.itensCarrinho[0]));
          }
        } catch (e) {
          console.error('Erro ao converter itens do carrinho:', e);
        }
      }

      if (params['carrinhoId']) {
        this.carrinhoId = Number(params['carrinhoId']);
        console.log('carrinhoId:', this.carrinhoId);
      }

      // Obtém o ID do usuário do localStorage
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.userId = Number(userId);
        console.log('ID do usuário:', this.userId);
      } else {
        console.warn(
          'Usuário não está logado ou o ID não foi salvo no localStorage.'
        );
      }

      // Verifica se tudo está pronto para enviar o pedido
      this.tentarCriarPedido();
    });
  }

  private tentarCriarPedido(): void {
    // Verifica se já tentou criar o pedido
    if (this.pedidoCriado) {
      console.log('Pedido já foi criado, não tentando novamente.');
      return;
    }

    // Verifica se todos os dados necessários estão disponíveis
    if (!this.userId) {
      console.warn('userId não disponível');
      return;
    }

    if (!this.enderecoId) {
      console.warn('enderecoId não disponível');
      return;
    }

    if (!this.itensCarrinho || this.itensCarrinho.length === 0) {
      console.warn('itensCarrinho não disponível ou vazio');
      return;
    }

    // Verifica se o token está disponível
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado no localStorage');
      return;
    }

    console.log('Todos os dados necessários estão disponíveis, criando pedido...');
    console.log('Token disponível:', token.substring(0, 20) + '...');

    // Prepara os dados do pedido
    const payload = {
      userId: this.userId,
      EnderecoId: this.enderecoId,
      itens: this.itensCarrinho.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario
      }))
    };

    console.log('Payload do pedido:', payload);
    console.log('Estrutura dos itens processados:', payload.itens);

    // Marca que já tentou criar o pedido
    this.pedidoCriado = true;

    this.pedidoService.criarPedido(payload).subscribe({
      next: (res) => {
        console.log('Pedido criado com sucesso:', res);

        // Limpa o carrinho após criar o pedido com sucesso
        if (this.carrinhoId) {
          this.carrinhoService.limparCarrinho().subscribe({
            next: () => {
              console.log('Carrinho limpo com sucesso.');
            },
            error: (err) => {
              console.error('Erro ao limpar carrinho:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Erro ao criar pedido:', err);
        console.error('Detalhes do erro:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error,
          url: err.url
        });

        // Reseta a flag para permitir nova tentativa
        this.pedidoCriado = false;
      },
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
