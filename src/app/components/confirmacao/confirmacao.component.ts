import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CarrinhoService } from '../../services/carrinho.service';
import { UserService } from '../../services/user.service';
import { Carrinho } from '../../interfaces/carrinho.interface';
import { UserProfile } from '../../models/user-profile.model';
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
  carregando = true;
  erro: string | null = null;
  etapaAtual = 3; // Etapa de confirmação

  constructor(
    private carrinhoService: CarrinhoService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
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
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar carrinho:', erro);
        this.erro = 'Erro ao carregar carrinho. Por favor, tente novamente.';
        this.carregando = false;
      }
    });
  }

  calcularTotal(): number {
    if (!this.carrinho?.itens) return 0;
    return this.carrinho.itens.reduce((total, item) => {
      return total + (item.precoUnitario * item.quantidade);
    }, 0);
  }

  finalizarPedido(): void {
    this.carregando = true;
    // Aqui você pode adicionar a lógica para finalizar o pedido no backend
    // Por enquanto, vamos apenas redirecionar para a página de conclusão
    this.router.navigate(['/concluir']);
  }

  voltarParaPagamento(): void {
    this.router.navigate(['/pagamento']);
  }
}
