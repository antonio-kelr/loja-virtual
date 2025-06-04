import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CarrinhoApiService } from '../../services/carrinho-api.service';
import { Carrinho, ItemCarrinho } from '../../interfaces/carrinho.interface';
import { Router } from '@angular/router';

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
    private carrinhoApiService: CarrinhoApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarCarrinho();
  }

  carregarCarrinho(): void {
    this.carregando = true;
    this.erro = null;

    this.carrinhoApiService.getCarrinho().subscribe({
      next: (carrinho) => {
        this.carrinho = carrinho;
        this.calcularTotal();
        this.carregando = false;
      },
      error: (erro) => {
        this.erro = 'Erro ao carregar o carrinho. Por favor, tente novamente.';
        this.carregando = false;
        console.error('Erro ao carregar carrinho:', erro);
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
    // Implementar lógica de finalização de compra
    console.log('Finalizando compra...');
  }

  continuarComprando(): void {
    this.router.navigate(['/']);
  }
}
