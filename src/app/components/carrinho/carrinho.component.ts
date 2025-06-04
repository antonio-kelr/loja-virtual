import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Carrinho, ItemCarrinho } from '../../interfaces/carrinho.interface';
import { Router } from '@angular/router';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, HeaderComponent, FooterComponent],
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

  constructor(
    private router: Router,
    private carrinhoService: CarrinhoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.carregarCarrinho();
    }
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
    const novaQuantidade = item.quantidade + incremento;
    if (novaQuantidade > 0) {
      item.quantidade = novaQuantidade;
      this.calcularTotal();
    }
  }

  removerItem(item: ItemCarrinho): void {
    if (this.carrinho) {
      this.carrinho.itens = this.carrinho.itens.filter(i => i.id !== item.id);
      this.calcularTotal();
    }
  }

  calcularTotal(): void {
    if (this.carrinho) {
      this.total = this.carrinho.itens.reduce((acc, item) => {
        return acc + (item.precoUnitario * item.quantidade);
      }, 0);
    }
  }

  finalizarCompra(): void {
    console.log('Finalizando compra...');
  }

  continuarComprando(): void {
    this.router.navigate(['/']);
  }
}
