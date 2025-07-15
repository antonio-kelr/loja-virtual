import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  enderecoId: number | null = null; // Adiciona propriedade para enderecoId

  // Dados do cartão de crédito
  numeroCartao: string = '';
  nomeCartao: string = '';
  validadeCartao: string = '';
  cvvCartao: string = '';
  cpfCartao: string = '';
  dataNascimento: string = '';

  // Validações do cartão
  numeroCartaoValido: boolean = true;
  validadeCartaoValida: boolean = true;
  cvvCartaoValido: boolean = true;
  nomeCartaoValido: boolean = true;
  cpfCartaoValido: boolean = true;
  dataNascimentoValida: boolean = true;

  constructor(
    private carrinhoService: CarrinhoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Carrega o enderecoId dos queryParams
    this.route.queryParams.subscribe(params => {
      if (params['enderecoId']) {
        this.enderecoId = Number(params['enderecoId']);
        console.log('Endereço selecionado:', this.enderecoId);
      }
    });

    // Usa o total do serviço compartilhado
    this.carrinhoService.getTotalCarrinho().subscribe(total => {
      if (total > 0) {
        this.totalCarrinho = total;
      }
    });

    // Carrega o carrinho apenas para garantir dados atualizados
    this.carregarCarrinho();
  }

  carregarCarrinho(): void {
    this.carrinhoService.buscarCarrinhoDoServidor().subscribe({
      next: (carrinho: Carrinho) => {
        // O total já é atualizado automaticamente pelo serviço
        console.log('Carrinho carregado:', carrinho);
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
        desconto: this.calcularEconomia(),
        enderecoId: this.enderecoId
      }
    });
  }

  voltarAoCarrinho(): void {
    this.router.navigate(['/carrinho']);
  }

  // Métodos para formatar e validar dados do cartão
  formatarNumeroCartao(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.numeroCartao = value.substring(0, 19);
    this.validarNumeroCartao();
    console.log('Número do cartão:', this.numeroCartao);
  }

  formatarValidade(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.validadeCartao = value.substring(0, 5);
    this.validarValidade();
    console.log('Validade:', this.validadeCartao);
  }

  formatarCVV(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    this.cvvCartao = value.substring(0, 4);
    this.validarCVV();
    console.log('CVV:', this.cvvCartao);
  }

  atualizarNomeCartao(event: any): void {
    this.nomeCartao = event.target.value.toUpperCase();
    this.validarNomeCartao();
    console.log('Nome:', this.nomeCartao);
  }

  formatarCPF(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.cpfCartao = value.substring(0, 14);
    this.validarCPF();
    console.log('CPF:', this.cpfCartao);
  }

  formatarDataNascimento(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }
    this.dataNascimento = value.substring(0, 10);
    this.validarDataNascimento();
    console.log('Data de Nascimento:', this.dataNascimento);
  }

  // Validações
  validarNumeroCartao(): void {
    const numero = this.numeroCartao.replace(/\s/g, '');

    // Verificar se tem pelo menos 13 dígitos (mínimo para cartões)
    if (numero.length < 13) {
      this.numeroCartaoValido = false;
      return;
    }

    // Algoritmo de Luhn para validar número do cartão
    let soma = 0;
    let ehPar = false;

    for (let i = numero.length - 1; i >= 0; i--) {
      let digito = parseInt(numero.charAt(i));

      if (ehPar) {
        digito *= 2;
        if (digito > 9) {
          digito -= 9;
        }
      }

      soma += digito;
      ehPar = !ehPar;
    }

    this.numeroCartaoValido = soma % 10 === 0;
  }

  validarValidade(): void {
    if (!this.validadeCartao || this.validadeCartao.length < 5) {
      this.validadeCartaoValida = false;
      return;
    }

    const [mes, ano] = this.validadeCartao.split('/');
    const mesAtual = new Date().getMonth() + 1;
    const anoAtual = new Date().getFullYear() % 100;
    const mesCartao = parseInt(mes);
    const anoCartao = parseInt(ano);

    // Verificar se o mês é válido (1-12)
    if (mesCartao < 1 || mesCartao > 12) {
      this.validadeCartaoValida = false;
      return;
    }

    // Verificar se não expirou
    if (anoCartao < anoAtual || (anoCartao === anoAtual && mesCartao < mesAtual)) {
      this.validadeCartaoValida = false;
      return;
    }

    this.validadeCartaoValida = true;
  }

  validarCVV(): void {
    const numero = this.numeroCartao.replace(/\s/g, '');
    const tipoCartao = this.getTipoCartao();

    // CVV deve ter 3 dígitos para Visa/Mastercard e 4 para Amex
    const cvvEsperado = tipoCartao === 'amex' ? 4 : 3;

    this.cvvCartaoValido = this.cvvCartao.length === cvvEsperado && /^\d+$/.test(this.cvvCartao);
  }

  validarNomeCartao(): void {
    this.nomeCartaoValido = this.nomeCartao.length >= 3 && /^[A-Z\s]+$/.test(this.nomeCartao);
  }

  validarCPF(): void {
    const cpf = this.cpfCartao.replace(/\D/g, '');

    if (cpf.length !== 11) {
      this.cpfCartaoValido = false;
      return;
    }

    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      this.cpfCartaoValido = false;
      return;
    }

    // Algoritmo de validação do CPF
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) {
      this.cpfCartaoValido = false;
      return;
    }

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) {
      this.cpfCartaoValido = false;
      return;
    }

    this.cpfCartaoValido = true;
  }

  validarDataNascimento(): void {
    if (!this.dataNascimento || this.dataNascimento.length < 10) {
      this.dataNascimentoValida = false;
      return;
    }

    const [dia, mes, ano] = this.dataNascimento.split('/');
    const dataNascimento = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    const hoje = new Date();

    // Verificar se a data é válida
    if (isNaN(dataNascimento.getTime())) {
      this.dataNascimentoValida = false;
      return;
    }

    // Verificar se a pessoa tem pelo menos 18 anos
    const idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = dataNascimento.getMonth();

    if (idade > 18 || (idade === 18 && mesAtual > mesNascimento) ||
        (idade === 18 && mesAtual === mesNascimento && hoje.getDate() >= dataNascimento.getDate())) {
      this.dataNascimentoValida = true;
    } else {
      this.dataNascimentoValida = false;
    }
  }

  // Verificar se todos os campos são válidos
  isFormularioValido(): boolean {
    return this.numeroCartaoValido &&
           this.validadeCartaoValida &&
           this.cvvCartaoValido &&
           this.nomeCartaoValido &&
           this.cpfCartaoValido &&
           this.dataNascimentoValida &&
           this.numeroCartao.length > 0 &&
           this.validadeCartao.length > 0 &&
           this.cvvCartao.length > 0 &&
           this.nomeCartao.length > 0 &&
           this.cpfCartao.length > 0 &&
           this.dataNascimento.length > 0;
  }

  // Método para obter o tipo de cartão baseado no número
  getTipoCartao(): string {
    const numero = this.numeroCartao.replace(/\s/g, '');
    if (numero.startsWith('4')) return 'visa';
    if (numero.startsWith('5')) return 'mastercard';
    if (numero.startsWith('3')) return 'amex';
    return 'generic';
  }
}
