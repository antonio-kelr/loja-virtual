import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CarrinhoService } from '../../services/carrinho.service';
import { UserService } from '../../services/user.service';
import { EnderecoService } from '../../services/endereco.service';
import { Carrinho } from '../../interfaces/carrinho.interface';
import { UserProfile } from '../../models/user-profile.model';
import { Endereco } from '../../interfaces/endereco.interface';
import { ResumoCarrinhoComponent } from '../resumo-carrinho/resumo-carrinho.component';
import { CheckoutStepsComponent } from '../checkout-steps/checkout-steps.component';
import { NavComponent } from "../nav/nav.component";

@Component({
  selector: 'app-confirmacao',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ResumoCarrinhoComponent,
    CheckoutStepsComponent,
    NavComponent
],
  templateUrl: './confirmacao.component.html',
  styleUrls: ['./confirmacao.component.scss']
})
export class ConfirmacaoComponent implements OnInit {
  dadosUsuario: UserProfile | null = null;
  carrinho: Carrinho | null = null;
  enderecos: Endereco[] = [];
  enderecoSelecionado: Endereco | null = null;
  carregando = true;
  erro: string | null = null;
  etapaAtual = 3; // Etapa de confirmação
  metodoPagamento: string = 'pix'; // Método de pagamento padrão

  constructor(
    private carrinhoService: CarrinhoService,
    private userService: UserService,
    private enderecoService: EnderecoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['metodoPagamento']) {
        this.metodoPagamento = params['metodoPagamento'];
      }
    });
    this.carregarDados();
  }

  private carregarDados() {
    this.carregando = true;
    this.erro = null;

    // Carregar dados do usuário
    this.userService.getUserProfile().subscribe({
      next: (dados) => {
        this.dadosUsuario = dados;
        this.carregarCarrinho();
        this.carregarEnderecos();
      },
      error: (erro) => {
        console.error('Erro ao carregar dados do usuário:', erro);
        this.erro = 'Erro ao carregar dados do usuário. Por favor, tente novamente.';
        this.carregando = false;
      }
    });
  }

  private carregarCarrinho() {
    this.carrinhoService.buscarCarrinhoDoServidor().subscribe({
      next: (carrinho) => {
        this.carrinho = carrinho;
        console.log('Todos os itens do carrinho:', carrinho.itens);
        this.verificarCarregamentoCompleto();
      },
      error: (erro) => {
        console.error('Erro ao carregar carrinho:', erro);
        this.erro = 'Erro ao carregar carrinho. Por favor, tente novamente.';
        this.carregando = false;
      }
    });
  }

  private carregarEnderecos() {
    this.enderecoService.listarEnderecos().subscribe({
      next: (enderecos) => {
        this.enderecos = enderecos;
        // Selecionar endereço principal por padrão
        const enderecoPrincipal = enderecos.find(e => e.principal);
        this.enderecoSelecionado = enderecoPrincipal || (enderecos.length > 0 ? enderecos[0] : null);
        this.verificarCarregamentoCompleto();
      },
      error: (erro) => {
        console.error('Erro ao carregar endereços:', erro);
        this.erro = 'Erro ao carregar endereços. Por favor, tente novamente.';
        this.carregando = false;
      }
    });
  }

  private verificarCarregamentoCompleto() {
    if (this.dadosUsuario && this.carrinho && this.enderecos.length > 0) {
      this.carregando = false;
    }
  }

  selecionarEndereco(endereco: Endereco): void {
    this.enderecoSelecionado = endereco;
  }

  calcularTotal(): number {
    if (!this.carrinho?.itens) return 0;
    return this.carrinho.itens.reduce((total, item) => {
      return total + (item.precoUnitario * item.quantidade);
    }, 0);
  }

  finalizarPedido(): void {
    if (!this.enderecoSelecionado) {
      alert('Por favor, selecione um endereço de entrega antes de finalizar o pedido.');
      return;
    }

    this.carregando = true;
    // Aqui você pode adicionar a lógica para finalizar o pedido no backend
    // Por enquanto, vamos apenas redirecionar para a página de conclusão
    this.router.navigate(['/concluir'], {
      queryParams: {
        metodoPagamento: this.metodoPagamento,
        valor: this.calcularTotal(),
        enderecoId: this.enderecoSelecionado.id,
        itens: JSON.stringify(this.carrinho?.itens)
      }
    });
  }

  voltarParaPagamento(): void {
    this.router.navigate(['/pagamento']);
  }
}
