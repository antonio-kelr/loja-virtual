import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FooterComponent } from '../footer/footer.component';
import { Carrinho, ItemCarrinho } from '../../interfaces/carrinho.interface';
import { Router } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { NavComponent } from "../nav/nav.component";
import { CheckoutStepsComponent } from '../checkout-steps/checkout-steps.component';
import { ResumoCarrinhoComponent } from '../resumo-carrinho/resumo-carrinho.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    FooterComponent,
    DialogModule,
    ButtonModule,
    ToastModule,
    NavComponent,
    CheckoutStepsComponent,
    ResumoCarrinhoComponent,
    ProgressSpinnerModule

  ],

  providers: [ConfirmationService, MessageService ],

  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.scss']
})
export class CarrinhoComponent implements OnInit {
  faTrash = faTrash;
  faMinus = faMinus;
  faPlus = faPlus;

  carrinho: Carrinho | null = null;
  total: number = 0;
  carregando: boolean = true;
  erro: string | null = null;
  isLoggedIn: boolean = false;
  displayEmailModal = false;
  itemParaRemover: ItemCarrinho | null = null;
  spinnerQuantidade: number | null = null;

  constructor(
    private router: Router,
    private carrinhoService: CarrinhoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.verificarLogin();
      if (this.isLoggedIn) {
        this.carregarCarrinho();
      }
    }
  }

  verificarLogin(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    this.isLoggedIn = !!(token && userId);
  }

  irParaLogin(): void {
    this.router.navigate(['/login']);
  }

  carregarCarrinho(): void {
    this.carregando = true;
    this.erro = null;

    this.carrinhoService.buscarCarrinhoDoServidor().subscribe({
      next: (dados) => {
        console.log('Dados do carrinho recebidos:', dados);
        this.carrinho = dados;
        this.calcularTotal();
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar carrinho:', error);
        this.erro = 'Erro ao carregar os dados do carrinho. Tente novamente.';
        this.carregando = false;
      }
    });
  }

  atualizarQuantidade(item: ItemCarrinho, incremento: number): void {
    console.log(`produtoId`, item.carrinhoId);
    console.log(`quantidade`, item.quantidade);

    const novaQuantidade = item.quantidade + incremento;
    console.log(`quantidade 2`, novaQuantidade);

    if (novaQuantidade > 0) {
      console.log(`quantidade 3`, novaQuantidade);

      item.quantidade = novaQuantidade;

      // Mostra o spinner para este item
      this.spinnerQuantidade = item.id;
      setTimeout(() => {
        this.spinnerQuantidade = null;
      }, 1000);

      this.carrinhoService.adicionarAoCarrinho(item.produtoId, novaQuantidade).subscribe({
        next: () => this.carregarCarrinho(),
        error: (error) => {
          console.error('Erro ao atualizar quantidade:', error);
        }
      });
    }
  }

  /**
   * Remove um item do carrinho
   * @param item Item a ser removido do carrinho
   */
  removerItem(item: ItemCarrinho): void {
    this.displayEmailModal = true;
    this.itemParaRemover = item;
  }

  confirmarRemocao(): void {
    if (!this.carrinho || !this.itemParaRemover) return;

    this.carregando = true;
    this.erro = null;

    this.carrinhoService.removerProdutoDoCarrinho(this.itemParaRemover.produtoId).subscribe({
      next: () => {
        console.log('Produto removido com sucesso');
        // Atualiza o carrinho local removendo o item
        this.carrinho!.itens = this.carrinho!.itens.filter(i => i.id !== this.itemParaRemover!.id);
        this.calcularTotal();
        this.carregando = false;
        this.displayEmailModal = false;
        this.itemParaRemover = null;

        // Mostra mensagem de sucesso
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Produto removido do carrinho com sucesso!'
        });
      },
      error: (error) => {
        console.error('Erro ao remover produto:', error);
        this.erro = 'Erro ao remover o produto do carrinho. Tente novamente.';
        this.carregando = false;
        this.displayEmailModal = false;
        this.itemParaRemover = null;

        // Mostra mensagem de erro
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao remover o produto do carrinho. Tente novamente.'
        });
      }
    });
  }

  calcularTotal(): void {
    if (this.carrinho) {
      this.total = this.carrinho.itens.reduce((acc, item) => {
        return acc + (item.precoUnitario * item.quantidade);
      }, 0);

      // Atualiza o total no serviço para compartilhar com outros componentes
      this.carrinhoService.atualizarTotalCarrinho(this.total);
    }
  }

  finalizarCompra(): void {
    this.router.navigate(['/pagamento']);
  }

  continuarComprando(): void {
    this.router.navigate(['/']);
  }

  limparCarrinho(): void {
    if (!this.carrinho) return;

    this.carregando = true;
    this.carrinhoService.limparCarrinho().subscribe({
      next: () => {
        console.log('Carrinho limpo com sucesso');
        this.carregarCarrinho(); // Recarrega o carrinho vazio
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Todos os produtos foram removidos do carrinho!'
        });
      },
      error: (error) => {
        console.error('Erro ao limpar carrinho:', error);
        this.carregando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao remover produtos do carrinho. Tente novamente.'
        });
      }
    });
  }

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
